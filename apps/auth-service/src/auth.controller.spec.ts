import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRole } from '@common/enums/user-roles.enum';

describe('AuthController', () => {
    let controller: AuthController;
    let service: AuthService;

    const user = { id: '1', email: 'a@example.com', firstName: 'A', lastName: 'A', role: UserRole.ADMIN, isActive: true };
    const tokens = { accessToken: 'token', refreshToken: 'token', user };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        createUser: jest.fn().mockResolvedValue(user),
                        login: jest.fn().mockResolvedValue(tokens),
                        refreshToken: jest.fn().mockResolvedValue(tokens),
                        logout: jest.fn().mockResolvedValue({ message: 'Logged out' }),
                        getUserById: jest.fn().mockResolvedValue(user),
                        validateUser: jest.fn().mockResolvedValue(user),
                    },
                },
            ],
        }).compile();
        controller = module.get<AuthController>(AuthController);
        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should register a user', async () => {
        expect(await controller.register({ email: 'a@example.com', password: 'pass', firstName: 'A', lastName: 'A', role: UserRole.ADMIN })).toEqual({ message: expect.any(String), data: tokens });
    });

    it('should login a user', async () => {
        expect(await controller.login({ email: 'a@example.com', password: 'pass' })).toEqual({ message: expect.any(String), data: tokens });
    });

    it('should refresh token', async () => {
        expect(await controller.refreshToken({ refreshToken: 'token' })).toEqual({ message: expect.any(String), data: tokens });
    });

    it('should logout', async () => {
        expect(await controller.logout({ user: { sub: '1' } })).toEqual({ message: expect.any(String) });
    });

    it('should get profile', async () => {
        expect(await controller.getProfile({ user: { sub: '1' } })).toEqual({ message: expect.any(String), data: user });
    });
}); 