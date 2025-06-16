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
  Query,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './user.schema';
import { JwtAuthGuard } from 'src/auth/wt-auth.guard';
import { UpdateUserDto } from './update-user.dto';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @Roles(UserRole.ADMIN)
  async getAllUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('role') role?: UserRole,
  ) {
    console.log(role)
    return this.usersService.getAllUsers(page, limit, role);
  }

  @Get('patients')
  @Roles(UserRole.DOCTOR)
  async getPatients(@Req() req: any, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.usersService.getPatientsForDoctor(req.user.id, page, limit);
  }

  @Get('profile')
  async getProfile(@Req() req: any) {
    console.log("hello from profile");
    console.log('req.user:', req.user);
    const userId = req.user.userId;
    if (!userId) {
      throw new ForbiddenException('User ID not found in token');
    }
    const user = await this.usersService.findById(userId);
    return user;
  }

  @Get(':id')
  async getUserById(@Req() req: any, @Param('id') id: string) {
    const currentUser = req.user;

    if (currentUser.role === UserRole.ADMIN) {
      return this.usersService.findById(id);
    }
    if (currentUser.role === UserRole.DOCTOR) {
      const user = await this.usersService.findById(id);
      if (user.role === UserRole.PATIENT && user.doctorId?.toString() === currentUser.id) {
        return user;
      }
      throw new ForbiddenException('Doctors can only access their patients');
    }
    if (currentUser.role === UserRole.PATIENT) {
      if (id !== currentUser.id) {
        throw new ForbiddenException('Patients can only access their own profile');
      }
      return this.usersService.findById(id);
    }
    throw new ForbiddenException('Unauthorized');
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))

  async createUser(
    @Body() body: any, 
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('createUser raw body:', body); 

    const userData = {
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role as UserRole,
      doctorId: body.doctorId || undefined,
      profilePicUrl: file ? `/uploads/profile-pics/${file.filename}` : undefined,
    };

    return this.usersService.createUser(userData);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async updateUser(
    @Req() req: any,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const profilePicUrl = file ? `/uploads/profile-pics/${file.filename}` : undefined;
    return this.usersService.updateUser(req.user, id, {
      ...updateUserDto,
      ...(profilePicUrl && { profilePicUrl }),
    });
  }
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteUser(@Req() req: any, @Param('id') id: string) {
    return this.usersService.deleteUser(req.user, id);
  }
}