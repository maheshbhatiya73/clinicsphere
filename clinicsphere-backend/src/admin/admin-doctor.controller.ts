import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/create-user.dto';
import { UpdateUserDto } from '../users/update-user.dto';
import { UserRole } from '../users/user.schema';
import { JwtAuthGuard } from 'src/auth/wt-auth.guard';
import { multerConfig } from 'src/config/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

@Controller('admin/doctors')
@UseGuards(JwtAuthGuard) // protect routes with JWT auth guard
export class AdminDoctorController {
  constructor(private readonly usersService: UsersService, private readonly configService: ConfigService) { }

  // GET /admin/doctors?page=1&limit=10
  @Get()
  async getAllDoctors(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    return this.usersService.getAllUsers(pageNumber, limitNumber, UserRole.DOCTOR);
  }
  
  @Get(':id')
  async getDoctorById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
  
  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async createDoctor(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const appUrl = this.configService.get<string>('APP_URL');
    const profilePicUrl = file
      ? `${appUrl}/uploads/profile-pics/${file.filename}`
      : undefined;
      
      console.log(body)
    const doctorData = {
      name: body.name,
      email: body.email,
      password: body.password,
      role: UserRole.DOCTOR,
      profilePicUrl,
      specialization: body.specialization,
      licenseNumber: body.licenseNumber,
      experienceYears: body.experienceYears,
      appointmentFee: body.appointmentFee,
      consultationDuration: body.consultationDuration,
      clinicAddress: body.clinicAddress,
      bio: body.bio,
    };

    return this.usersService.createUser(doctorData);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async updateDoctor(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const currentUser = { role: UserRole.ADMIN, userId: 'admin' } as any;

    const appUrl = this.configService.get<string>('APP_URL');
    const profilePicUrl = file ? `${appUrl}/uploads/profile-pics/${file.filename}` : undefined;

    return this.usersService.updateUser(currentUser, id, {
      ...updateUserDto,
      ...(profilePicUrl && { profilePicUrl }),
    });
  } 
  @Delete(':id')
  async deleteDoctor(@Param('id') id: string) {
    // For admin deleting doctor, pass dummy currentUser with role ADMIN
    const currentUser = { role: UserRole.ADMIN } as any;
    return this.usersService.deleteUser(currentUser, id);
  }
}
