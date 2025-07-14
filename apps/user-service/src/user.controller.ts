import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '@common/enums/user-roles.enum';
import { ResponseMessages } from '@common/constants/response-messages';
import { PaginationOptions } from '@common/interfaces/pagination.interface';
import {
    CreateUserDto,
    UpdateUserDto,
    UpdateUserRoleDto,
} from '@common/dto/user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
    constructor(private userService: UserService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new user (Admin only)' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @Roles(UserRole.ADMIN)
    async createUser(@Body() createUserDto: CreateUserDto) {
        const user = await this.userService.createUser(createUserDto);
        return {
            message: ResponseMessages.USER_CREATED,
            data: user,
        };
    }

    @Get()
    @ApiOperation({ summary: 'Get all users (Admin only)' })
    @ApiResponse({ status: 200, description: 'List of users' })
    @Roles(UserRole.ADMIN)
    async getAllUsers(@Query() query: PaginationOptions) {
        const result = await this.userService.findAll(query);
        return {
            message: ResponseMessages.SUCCESS,
            data: result,
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID (Admin only)' })
    @ApiResponse({ status: 200, description: 'User details' })
    @Roles(UserRole.ADMIN)
    async getUserById(@Param('id') id: string) {
        const user = await this.userService.findById(id);
        return {
            message: ResponseMessages.SUCCESS,
            data: user,
        };
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update user (Admin only)' })
    @ApiResponse({ status: 200, description: 'User updated successfully' })
    @Roles(UserRole.ADMIN)
    async updateUser(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        const user = await this.userService.updateUser(id, updateUserDto);
        return {
            message: ResponseMessages.USER_UPDATED,
            data: user,
        };
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete user (Admin only)' })
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    @Roles(UserRole.ADMIN)
    async deleteUser(@Param('id') id: string) {
        await this.userService.deleteUser(id);
        return {
            message: ResponseMessages.USER_DELETED,
        };
    }

    @Put(':id/role')
    @ApiOperation({ summary: 'Update user role (Admin only)' })
    @ApiResponse({ status: 200, description: 'User role updated successfully' })
    @Roles(UserRole.ADMIN)
    async updateUserRole(
        @Param('id') id: string,
        @Body() body: UpdateUserRoleDto,
    ) {
        const user = await this.userService.updateUserRole(id, body.role);
        return {
            message: ResponseMessages.ROLE_UPDATED,
            data: user,
        };
    }
}
