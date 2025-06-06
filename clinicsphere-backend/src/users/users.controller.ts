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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './user.schema';
import { JwtAuthGuard } from 'src/auth/wt-auth.guard';
import { CreateUserDto } from './reate-user.dto';
import { UpdateUserDto } from './update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  async getPatients(@Req() req:any, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.usersService.getPatientsForDoctor(req.user.id, page, limit);
  }

  @Get(':id')
  async getUserById(@Req() req:any, @Param('id') id: string) {
    console.log('getUserById', id);
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
  @Roles(UserRole.ADMIN)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  async updateUser(@Req() req:any, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(req.user, id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteUser(@Req() req:any, @Param('id') id: string) {
    return this.usersService.deleteUser(req.user, id);
  }
}