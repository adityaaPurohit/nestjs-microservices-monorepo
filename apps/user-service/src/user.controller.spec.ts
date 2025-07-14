import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRole } from '@common/enums/user-roles.enum';

describe('UserController', () => {
    let controller: UserController;
    let service: UserService;

    const user = { id: '1', email: 'a@example.com', firstName: 'A', lastName: 'A', role: UserRole.VIEWER, isActive: true };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: {
                        createUser: jest.fn().mockResolvedValue(user),
                        findAll: jest.fn().mockResolvedValue([user]),
                        findById: jest.fn().mockResolvedValue(user),
                        updateUser: jest.fn().mockResolvedValue(user),
                        deleteUser: jest.fn().mockResolvedValue(undefined),
                        updateUserRole: jest.fn().mockResolvedValue(user),
                        deactivateUser: jest.fn().mockResolvedValue({ ...user, isActive: false }),
                        activateUser: jest.fn().mockResolvedValue({ ...user, isActive: true }),
                        getUsersByRole: jest.fn().mockResolvedValue([user]),
                    },
                },
            ],
        }).compile();
        controller = module.get<UserController>(UserController);
        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create a user', async () => {
        expect(await controller.createUser(user as any)).toEqual({ message: expect.any(String), data: user });
    });

    it('should get all users', async () => {
        expect(await controller.getAllUsers({})).toEqual({ message: expect.any(String), data: [user] });
    });
    it('should get user by id', async () => {
        expect(await controller.getUserById('1')).toEqual({ message: expect.any(String), data: user });
    });

    it('should update user', async () => {
        expect(await controller.updateUser('1', { firstName: 'Updated' })).toEqual({ message: expect.any(String), data: user });
    });

    it('should delete user', async () => {
        expect(await controller.deleteUser('1')).toEqual({ message: expect.any(String) });
    });

    it('should update user role', async () => {
        expect(await controller.updateUserRole('1', { role: UserRole.ADMIN })).toEqual({ message: expect.any(String), data: user });
    });
}); 