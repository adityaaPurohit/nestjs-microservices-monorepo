import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@database/entities/user.entity';
import { ResponseMessages } from '@common/constants/response-messages';
import { RegisterDto } from '@common/dto/auth.dto';
import { UserRole } from '@common/enums/user-roles.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !user.isActive) {
      throw new UnauthorizedException(ResponseMessages.UNAUTHORIZED);
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(ResponseMessages.UNAUTHORIZED);
    }

    return user;
  }

  async createUser(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.userRepository.create({
      ...registerDto,
      role: registerDto.role ? (registerDto.role as UserRole) : UserRole.VIEWER,
    });

    return this.userRepository.save(user);
  }

  async login(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException(ResponseMessages.UNAUTHORIZED);
      }

      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException(ResponseMessages.UNAUTHORIZED);
    }
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException(ResponseMessages.UNAUTHORIZED);
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException(ResponseMessages.UNAUTHORIZED);
    }
  }

  async logout(userId: string) {
    await this.userRepository.update(userId, {
      lastLoginAt: null,
    });

    return { message: ResponseMessages.LOGOUT_SUCCESS };
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedException(ResponseMessages.NOT_FOUND);
    }

    return user;
  }
}
