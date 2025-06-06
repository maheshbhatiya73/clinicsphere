import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument, UserRole } from './user.schema';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { CreateUserDto, } from './reate-user.dto';
import { UpdateUserDto } from './update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async findById(id: string): Promise<UserDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid user ID');
    }
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getUserById(id: string): Promise<UserDocument> {
    return this.findById(id);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(email: string, password: string): Promise<UserDocument | null> {

    const user = await this.findByEmail(email);
    
    if (!user || !password || !user.password) {
      return null;
    }
    console.log(email, password, user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }


  async getAllUsers(page = 1, limit = 10, role?: UserRole) {
    const query = role ? { role } : {};
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userModel.find(query).skip(skip).limit(limit).exec(),
      this.userModel.countDocuments(query).exec(),
    ]);
    this.logger.log(`Fetched ${users.length} users, page: ${page}, limit: ${limit}`);
    return { users, total, page, limit };
  }

  async getPatientsForDoctor(doctorId: string, page = 1, limit = 10) {
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new NotFoundException('Invalid doctor ID');
    }
    const skip = (page - 1) * limit;
    const [patients, total] = await Promise.all([
      this.userModel
        .find({ doctorId, role: UserRole.PATIENT })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments({ doctorId, role: UserRole.PATIENT }).exec(),
    ]);
    this.logger.log(`Fetched ${patients.length} patients for doctor ${doctorId}`);
    return { patients, total, page, limit };
  }

  async createUser(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const createdUser = new this.userModel({
      ...data,
      password: hashedPassword,
      activityLog: [{ action: 'User created', timestamp: new Date() }],
    });
    const savedUser = await createdUser.save();
    this.logger.log(`Created user: ${savedUser.email}`);
    return savedUser;
  }

  async updateUser(currentUser: UserDocument, userIdToUpdate: string, updateData: UpdateUserDto) {
    const user = await this.findById(userIdToUpdate);
    const updateFields = { ...updateData };

    if (updateData && updateData.password) {
      updateFields.password = await bcrypt.hash(updateData.password, 12);
    }

    if (currentUser.role === UserRole.ADMIN) {
      Object.assign(user, updateFields);
      user.activityLog = user.activityLog || [];
      user.activityLog.push({ action: 'Profile updated by admin', timestamp: new Date() });
      const updatedUser = await user.save();
      this.logger.log(`Admin updated user: ${userIdToUpdate}`);
      return updatedUser;
    }

    if (currentUser.role === UserRole.DOCTOR) {
      if (user.role !== UserRole.PATIENT || user.doctorId?.toString() !== currentUser._id.toString()) {
        throw new ForbiddenException('Doctors can only update their own patients');
      }
      if ('role' in updateFields || 'doctorId' in updateFields) {
        throw new ForbiddenException('Doctors cannot change role or doctor assignment');
      }
      Object.assign(user, updateFields);
      user.activityLog = user.activityLog || [];
      user.activityLog.push({ action: 'Profile updated by doctor', timestamp: new Date() });
      const updatedUser = await user.save();
      this.logger.log(`Doctor updated patient: ${userIdToUpdate}`);
      return updatedUser;
    }

    if (currentUser.role === UserRole.PATIENT) {
      if (user._id.toString() !== currentUser._id.toString()) {
        throw new ForbiddenException('Patients can only update their own profile');
      }
      if ('role' in updateFields || 'doctorId' in updateFields || 'email' in updateFields) {
        throw new ForbiddenException('Patients cannot change role, doctor, or email');
      }
      Object.assign(user, updateFields);
      user.activityLog = user.activityLog || [];
      user.activityLog.push({ action: 'Profile updated by patient', timestamp: new Date() });
      const updatedUser = await user.save();
      this.logger.log(`Patient updated own profile: ${userIdToUpdate}`);
      return updatedUser;
    }

    throw new ForbiddenException('Unauthorized to update user');
  }

  async deleteUser(currentUser: UserDocument, userIdToDelete: string) {
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admin can delete users');
    }
    const user = await this.findById(userIdToDelete);
    await this.userModel.deleteOne({ _id: user._id });
    this.logger.log(`Deleted user: ${userIdToDelete}`);
    return { message: 'User deleted successfully' };
  }

  async requestPasswordReset(email: string) {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    this.logger.log(`Password reset requested for: ${email}`);
    return { message: 'Password reset token generated', token };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userModel
      .findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
      })
      .exec();

    if (!user) throw new NotFoundException('Invalid or expired token');

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.activityLog = user.activityLog || [];
    user.activityLog.push({ action: 'Password reset', timestamp: new Date() });
    await user.save();

    this.logger.log(`Password reset for user: ${user.email}`);
    return { message: 'Password reset successfully' };
  }


}