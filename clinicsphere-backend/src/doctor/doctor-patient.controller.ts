import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    UseGuards,
    Req,
    NotFoundException,
    ForbiddenException,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/wt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from '../users/user.schema';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/create-user.dto';
import { UpdateUserDto } from '../users/update-user.dto';
import { Types } from 'mongoose';

@Controller('doctor/patients')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DOCTOR)
export class DoctorPatientsController {
    constructor(private readonly usersService: UsersService) { }

    @Get(':id')
    async getPatientById(@Req() req: any, @Param('id') patientId: string) {
        console.log('Fetching patient by ID:', patientId);
        const doctorId = req.user._id;
        const patient = await this.usersService.findById(patientId);
        if (!patient) throw new NotFoundException('Patient not found');
        if (patient.doctorId?.toString() !== doctorId.toString()) {
            throw new ForbiddenException('Access denied to this patient');
        }
        return patient;
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createPatient(@Req() req: any, @Body() dto: CreateUserDto) {
        const user = req.user;
        console.log('req.user:', user);

        if (!user) {
            throw new UnauthorizedException('User not found in request');
        }

        if (user.role !== UserRole.DOCTOR) {
            throw new ForbiddenException('Only doctors can create patients');
        }
        const doctorId = user.userId;
        if (!doctorId) {
            throw new InternalServerErrorException('Doctor ID missing');
        }

        const createPayload = {
            ...dto,
            role: UserRole.PATIENT,
            doctorId: doctorId.toString(),
        };

        return this.usersService.createUser(createPayload);
    }


    @Get()
    async getAllPatients(@Req() req: any) {
        const doctorId = req.user.userId;
        console.log('Fetching patients for doctor:', doctorId);
        return this.usersService.getPatientsByDoctorId(doctorId);
    }


    @Put(':id')
    async updatePatient(
        @Req() req: any,
        @Param('id') patientId: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        const user = req.user;
        const patient = await this.usersService.findById(patientId);
        if (!patient) throw new NotFoundException('Patient not found');
        
        if (user.role === UserRole.DOCTOR) {
            if (patient.doctorId?.toString() !== user.userId.toString()) {
                throw new ForbiddenException('Access denied to update this patient');
            }
        }
        console.log('Updating patient:', patientId, 'by doctor:', user.userId);

        return this.usersService.updateUser(user, patientId, updateUserDto);
    }


    @Delete(':id')
    async deletePatient(@Req() req: any, @Param('id') patientId: string) {
        const doctorId = req.user.userId;
        const patient = await this.usersService.findById(patientId);
        if (!patient) throw new NotFoundException('Patient not found');
        if (patient.doctorId?.toString() !== doctorId.toString()) {
            throw new ForbiddenException('Access denied to delete this patient');
        }
        return this.usersService.deleteUser(req.user, patientId);
    }
}
