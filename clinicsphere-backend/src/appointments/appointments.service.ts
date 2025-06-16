import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentDocument, AppointmentStatus } from './appointment.schema';
import { CreateAppointmentDto } from './create-appointment.dto';
import { UpdateAppointmentDto } from './update-appointment.dto';
import { UserRole, UserDocument } from '../users/user.schema';
import { UsersService } from '../users/users.service';

interface JwtUser {
  userId: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
    private readonly usersService: UsersService,
  ) { }

  async createAppointment(currentUser: JwtUser, createAppointmentDto: CreateAppointmentDto) {
    const { doctorId, appointmentDate, startTime, endTime } = createAppointmentDto;
    const patientId = currentUser.userId;

    const doctor = await this.usersService.findById(doctorId);
    const patient = await this.usersService.findById(patientId);

    if (!doctor || doctor.role !== UserRole.DOCTOR) {
      throw new NotFoundException('Doctor not found');
    }
    if (!patient || patient.role !== UserRole.PATIENT) {
      throw new NotFoundException('Patient not found');
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start >= end) {
      throw new BadRequestException('End time must be after start time');
    }

    const overlappingAppointments = await this.appointmentModel.find({
      doctorId,
      appointmentDate: new Date(appointmentDate),
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } },
        { startTime: { $gte: start, $lte: end } },
      ],
      status: { $ne: AppointmentStatus.CANCELLED },
    }).exec();

    if (overlappingAppointments.length > 0) {
      throw new BadRequestException('Time slot is already booked');
    }

    if (currentUser.role === UserRole.PATIENT && currentUser.userId !== patientId) {
      throw new ForbiddenException('Patients can only book their own appointments');
    }

    if (currentUser.role === UserRole.DOCTOR) {
      throw new ForbiddenException('Doctors cannot create appointments on behalf of patients');
    }

    const appointment = new this.appointmentModel({
      ...createAppointmentDto,
      patientId,
      appointmentDate: new Date(appointmentDate),
      startTime: start,
      endTime: end,
      status: createAppointmentDto.status || AppointmentStatus.SCHEDULED,
    });

    const savedAppointment = await appointment.save();
    this.logger.log(`Appointment created: ${savedAppointment._id}`);
    return savedAppointment;
  }

  async getAllAppointments(
    currentUser: JwtUser,
    page = 1,
    limit = 10,
    role?: UserRole,
  ) {
    if (!currentUser?.userId) {
      throw new BadRequestException('Missing userId');
    }

    console.log("getting users from ", currentUser)
    const query: any = {};

    const userIdStr = currentUser.userId.toString();

    if (currentUser.role === UserRole.DOCTOR) {
      query.doctorId = userIdStr;
    } else if (currentUser.role === UserRole.PATIENT) {
      query.patientId = userIdStr;
    }

    if (role) {
      const users = await this.usersService.getAllUsers(1, 1000, role);
      const userIds = users.users.map((user: UserDocument) => user._id);

      if (currentUser.role === UserRole.DOCTOR) {
        query.patientId = { $in: userIds };
      } else if (currentUser.role === UserRole.ADMIN) {
        query[role === UserRole.DOCTOR ? 'doctorId' : 'patientId'] = {
          $in: userIds,
        };
      }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [appointments, total] = await Promise.all([
      this.appointmentModel
        .find(query)
        .skip(skip)
        .limit(Number(limit))
        .populate('doctorId patientId')
        .exec(),
      this.appointmentModel.countDocuments(query).exec(),
    ]);

    return {
      appointments,
      total,
      page: Number(page),
      limit: Number(limit),
    };
  }

  async getAppointmentById(currentUser: JwtUser, appointmentId: string) {
    if (!Types.ObjectId.isValid(appointmentId)) {
      throw new NotFoundException('Invalid appointment ID');
    }
    const appointment = await this.appointmentModel.findById(appointmentId).populate('doctorId patientId').exec();
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (currentUser.role === UserRole.DOCTOR && appointment.doctorId._id.toString() !== currentUser.userId) {
      throw new ForbiddenException('Doctors can only access their own appointments');
    }
    if (currentUser.role === UserRole.PATIENT && appointment.patientId._id.toString() !== currentUser.userId) {
      throw new ForbiddenException('Patients can only access their own appointments');
    }

    return appointment;
  }

  async updateAppointment(currentUser: JwtUser, appointmentId: string, updateAppointmentDto: UpdateAppointmentDto) {
    const appointment = await this.appointmentModel.findById(appointmentId).exec();
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (currentUser.role === UserRole.DOCTOR && appointment.doctorId.toString() !== currentUser.userId) {
      throw new ForbiddenException('Doctors can only update their own appointments');
    }
    if (currentUser.role === UserRole.PATIENT && appointment.patientId.toString() !== currentUser.userId) {
      throw new ForbiddenException('Patients can only update their own appointments');
    }

    if (updateAppointmentDto.startTime || updateAppointmentDto.endTime || updateAppointmentDto.appointmentDate) {
      const start = updateAppointmentDto.startTime ? new Date(updateAppointmentDto.startTime) : appointment.startTime;
      const end = updateAppointmentDto.endTime ? new Date(updateAppointmentDto.endTime) : appointment.endTime;
      const date = updateAppointmentDto.appointmentDate
        ? new Date(updateAppointmentDto.appointmentDate)
        : appointment.appointmentDate;

      if (start >= end) {
        throw new BadRequestException('End time must be after start time');
      }

      const overlappingAppointments = await this.appointmentModel
        .find({
          doctorId: appointment.doctorId,
          appointmentDate: date,
          $or: [
            { startTime: { $lt: end }, endTime: { $gt: start } },
            { startTime: { $gte: start, $lte: end } },
          ],
          status: { $ne: AppointmentStatus.CANCELLED },
          _id: { $ne: appointmentId },
        })
        .exec();

      if (overlappingAppointments.length > 0) {
        throw new BadRequestException('Time slot is already booked');
      }
    }

    const updateFields = { ...updateAppointmentDto };
    if (updateAppointmentDto.appointmentDate) {
      updateFields.appointmentDate = new Date(updateAppointmentDto.appointmentDate).toISOString();
    }
    if (updateAppointmentDto.startTime) {
      updateFields.startTime = new Date(updateAppointmentDto.startTime).toISOString();
    }
    if (updateAppointmentDto.endTime) {
      updateFields.endTime = new Date(updateAppointmentDto.endTime).toISOString();
    }

    Object.assign(appointment, updateFields);
    const updatedAppointment = await appointment.save();
    this.logger.log(`Appointment updated: ${appointmentId} by ${currentUser.role}`);
    return updatedAppointment;
  }

  async deleteAppointment(currentUser: JwtUser, appointmentId: string) {
    const appointment = await this.appointmentModel.findById(appointmentId).exec();
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (currentUser.role === UserRole.DOCTOR && appointment.doctorId.toString() !== currentUser.userId) {
      throw new ForbiddenException('Doctors can only delete their own appointments');
    }
    if (currentUser.role === UserRole.PATIENT && appointment.patientId.toString() !== currentUser.userId) {
      throw new ForbiddenException('Patients can only delete their own appointments');
    }

    await this.appointmentModel.deleteOne({ _id: appointmentId });
    this.logger.log(`Appointment deleted: ${appointmentId} by ${currentUser.role}`);
    return { message: 'Appointment deleted successfully' };
  }
}