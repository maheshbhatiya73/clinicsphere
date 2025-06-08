import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './user.schema';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersService, JwtStrategy],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
