import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseMessages } from '@common/constants/response-messages';
import { 
    LoginDto, 
    RegisterDto, 
    RefreshTokenDto, 
    LoginResponseDto, 
    RegisterResponseDto 
} from '@common/dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @ApiOperation({ 
        summary: 'User login',
        description: 'Authenticate user with email and password to get access token'
    })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ 
        status: 201, 
        description: 'Login successful',
        type: LoginResponseDto
    })
    @ApiResponse({ 
        status: 401, 
        description: 'Invalid credentials' 
    })
    @ApiResponse({ 
        status: 400, 
        description: 'Validation error' 
    })
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(
            loginDto.email,
            loginDto.password,
        );

        const result = await this.authService.login(user);

        return {
            message: ResponseMessages.LOGIN_SUCCESS,
            data: result,
        };
    }

    @Post('register')
    @ApiOperation({ 
        summary: 'Register a new user',
        description: 'Create a new user account and return access token'
    })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({ 
        status: 201, 
        description: 'User created successfully',
        type: RegisterResponseDto
    })
    @ApiResponse({ 
        status: 409, 
        description: 'User already exists' 
    })
    @ApiResponse({ 
        status: 400, 
        description: 'Validation error' 
    })
    async register(@Body() registerDto: RegisterDto) {
        const user = await this.authService.createUser(registerDto);
        const result = await this.authService.login(user);

        return {
            message: ResponseMessages.USER_CREATED,
            data: result,
        };
    }

    @Post('refresh')
    @ApiOperation({ 
        summary: 'Refresh JWT token',
        description: 'Get new access token using refresh token'
    })
    @ApiBody({ type: RefreshTokenDto })
    @ApiResponse({ 
        status: 201, 
        description: 'Token refreshed successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Success' },
                data: {
                    type: 'object',
                    properties: {
                        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                        refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
                    }
                }
            }
        }
    })
    @ApiResponse({ 
        status: 401, 
        description: 'Invalid refresh token' 
    })
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
        const result = await this.authService.refreshToken(
            refreshTokenDto.refreshToken,
        );

        return {
            message: ResponseMessages.SUCCESS,
            data: result,
        };
    }

    @Post('logout')
    @ApiOperation({ 
        summary: 'Logout user',
        description: 'Invalidate user session and tokens'
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Logout successful',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Logout successful' }
            }
        }
    })
    @ApiResponse({ 
        status: 401, 
        description: 'Unauthorized' 
    })
    async logout(@Req() req) {
        const result = await this.authService.logout(req.user.sub);
        return result;
    }

    @Get('profile')
    @ApiOperation({ 
        summary: 'Get current user profile',
        description: 'Retrieve profile information for authenticated user'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'User profile retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Success' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                        email: { type: 'string', example: 'user@example.com' },
                        firstName: { type: 'string', example: 'John' },
                        lastName: { type: 'string', example: 'Doe' },
                        role: { type: 'string', example: 'VIEWER' },
                        isActive: { type: 'boolean', example: true },
                        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
                        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
                    }
                }
            }
        }
    })
    @ApiResponse({ 
        status: 401, 
        description: 'Unauthorized' 
    })
    async getProfile(@Req() req) {
        const user = await this.authService.getUserById(req.user.sub);
        return {
            message: ResponseMessages.SUCCESS,
            data: user,
        };
    }
}
