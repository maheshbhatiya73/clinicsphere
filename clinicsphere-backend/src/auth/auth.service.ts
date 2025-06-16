import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/user.schema';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.validateUser(email, password);
    if (!user) {
      this.logger.warn(`Failed login attempt for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    this.logger.log(`User logged in: ${user.email}`);
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(name: string, email: string, password: string, role: UserRole) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      this.logger.warn(`Registration failed: Email already registered: ${email}`);
      throw new UnauthorizedException('Email already registered');
    }
    const newUser = await this.usersService.createUser({ name, email, password, role });
    this.logger.log(`User registered: ${email}`);
    return newUser;
  }

  async requestPasswordReset(email: string) {
    return this.usersService.requestPasswordReset(email);
  }

  async resetPassword(token: string, newPassword: string) {
    return this.usersService.resetPassword(token, newPassword);
  }
}