import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@database/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@common/enums/user-roles.enum';

describe('AuthService', () => {
  let service: AuthService;
  let repo: Repository<User>;
  let jwt: JwtService;

  const user = { id: '1', email: 'a@example.com', password: 'hashed', isActive: true, role: UserRole.ADMIN, validatePassword: jest.fn().mockResolvedValue(true) } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
            verify: jest.fn().mockReturnValue({ sub: '1', email: 'a@example.com', role: UserRole.ADMIN }),
          },
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
    jwt = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      jest.spyOn(repo, 'create').mockReturnValue(user);
      jest.spyOn(repo, 'save').mockResolvedValue(user);
      const result = await service.createUser({ email: 'a@example.com', password: 'pass', firstName: 'A', lastName: 'A', role: UserRole.ADMIN });
      expect(result).toEqual(user);
    });
    it('should throw if user exists', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(user);
      await expect(service.createUser({ email: 'a@example.com', password: 'pass', firstName: 'A', lastName: 'A', role: UserRole.ADMIN })).rejects.toThrow(ConflictException);
    });
  });

  describe('validateUser', () => {
    it('should return user if valid', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(user);
      user.validatePassword = jest.fn().mockResolvedValue(true);
      expect(await service.validateUser('a@example.com', 'pass')).toEqual(user);
    });
    it('should throw if user not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.validateUser('a@example.com', 'pass')).rejects.toThrow(UnauthorizedException);
    });
    it('should throw if password invalid', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(user);
      user.validatePassword = jest.fn().mockResolvedValue(false);
      await expect(service.validateUser('a@example.com', 'wrong')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return tokens and user', async () => {
      jest.spyOn(jwt, 'sign').mockReturnValue('token');
      jest.spyOn(repo, 'update').mockResolvedValue(undefined as any);
      const result = await service.login(user);
      expect(result.accessToken).toBe('token');
      expect(result.refreshToken).toBe('token');
      expect(result.user.email).toBe(user.email);
    });
  });
}); 