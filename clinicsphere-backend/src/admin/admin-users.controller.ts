import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Query,
    UseGuards,
    Req,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.schema';
import { JwtAuthGuard } from 'src/auth/wt-auth.guard';
import { CreateUserDto } from 'src/users/reate-user.dto';
import { UpdateUserDto } from 'src/users/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { ConfigService } from '@nestjs/config';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminUsersController {
    constructor(private readonly usersService: UsersService, private readonly configService: ConfigService) { }

    @Get()
    getAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('role') role?: UserRole,
    ) {
        return this.usersService.getAllUsers(+page, +limit, role);
    }

    @Get(':id')
    getById(@Param('id') id: string) {
        return this.usersService.findById(id);
    }


    @Post()
    @UseInterceptors(FileInterceptor('file', multerConfig))
    async create(
        @Body() body: any,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const appUrl = this.configService.get<string>('APP_URL');
        const profilePicUrl = file
            ? `${appUrl}/uploads/profile-pics/${file.filename}`
            : undefined;

        const userData = {
            name: body.name,
            email: body.email,
            password: body.password,
            role: body.role,
            doctorId: body.doctorId,
            profilePicUrl: profilePicUrl,
        };

        return this.usersService.createUser(userData);
    }
    @Put(':id')
    @UseInterceptors(FileInterceptor('file', multerConfig))
    async update(
        @Req() req: any,
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: UpdateUserDto, 
    ) {
        const appUrl = this.configService.get<string>('APP_URL');
        const profilePicUrl = file
            ? `${appUrl}/uploads/profile-pics/${file.filename}`
            : undefined;

        const updateData = {
            ...body,
            profilePicUrl,
        };

        return this.usersService.updateUser(req.user, id, updateData);
    }

    @Delete(':id')
    delete(@Req() req: any, @Param('id') id: string) {
        return this.usersService.deleteUser(req.user, id);
    }

}
