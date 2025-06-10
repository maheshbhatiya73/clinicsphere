import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from 'src/auth/wt-auth.guard';

@Controller('doctor')
export class DoctorPublicController {
  constructor(private readonly usersService: UsersService) {}

  @Get('list')
  async listDoctors() {
    return this.usersService.getAllDoctors();
  }
}
