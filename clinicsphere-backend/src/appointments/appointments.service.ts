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
    console.log("paintId", patientId);
    console.log("doctorId", doctorId);

    // Validate doctor and patient exist
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

  async getAllAppointments(currentUser: JwtUser, page = 1, limit = 10, role?: UserRole) {
    let query: any = {};
    if (currentUser.role === UserRole.DOCTOR) {
      query.doctorId = new Types.ObjectId(currentUser.userId);
    } else if (currentUser.role === UserRole.PATIENT) {
      query.patientId = new Types.ObjectId(currentUser.userId);
    }
    if (role) {
      const userQuery = { role };
      const users = await this.usersService.getAllUsers(1, 1000, role);
      const userIds = users.users.map((user: UserDocument) => user._id);
      if (currentUser.role === UserRole.DOCTOR) {
        query.patientId = { $in: userIds };
      } else if (currentUser.role === UserRole.ADMIN) {
        query = role === UserRole.DOCTOR ? { doctorId: { $in: userIds } } : { patientId: { $in: userIds } };
      }
    }

    const skip = (page - 1) * limit;
    const [appointments, total] = await Promise.all([
      this.appointmentModel.find(query).skip(skip).limit(limit).populate('doctorId patientId').exec(),
      this.appointmentModel.countDocuments(query).exec(),
    ]);

    this.logger.log(`Fetched ${appointments.length} appointments, page: ${page}, limit: ${limit}`);
    return { appointments, total, page, limit };
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

    // Validate time slot if updating
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