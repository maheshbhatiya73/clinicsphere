import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Controller('doctor')
export class DoctorPublicController {
  constructor(private readonly usersService: UsersService) {}

  @Get('list')
  async listDoctors() {
    return this.usersService.getAllDoctors();
  }
}
