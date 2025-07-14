import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@database/entities/user.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserRole } from '@common/enums/user-roles.enum';

const userArray = [
    { id: '1', email: 'a@example.com', firstName: 'A', lastName: 'A', role: UserRole.VIEWER, isActive: true },
    { id: '2', email: 'b@example.com', firstName: 'B', lastName: 'B', role: UserRole.EDITOR, isActive: true },
];

describe('UserService', () => {
    let service: UserService;
    let repo: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        findOne: jest.fn(),
                        findAndCount: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();
        service = module.get<UserService>(UserService);
        repo = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            jest.spyOn(repo, 'findOne').mockResolvedValue(null);
            jest.spyOn(repo, 'create').mockReturnValue(userArray[0] as any);
            jest.spyOn(repo, 'save').mockResolvedValue(userArray[0] as any);
            const result = await service.createUser({ email: 'a@example.com', firstName: 'A', lastName: 'A', password: 'pass', role: UserRole.VIEWER });
            expect(result).toEqual(userArray[0]);
        });
        it('should throw if user exists', async () => {
            jest.spyOn(repo, 'findOne').mockResolvedValue(userArray[0] as any);
            await expect(service.createUser({ email: 'a@example.com', firstName: 'A', lastName: 'A', password: 'pass', role: UserRole.VIEWER })).rejects.toThrow(ConflictException);
        });
    });

    describe('findById', () => {
        it('should return a user', async () => {
            jest.spyOn(repo, 'findOne').mockResolvedValue(userArray[0] as any);
            expect(await service.findById('1')).toEqual(userArray[0]);
        });
        it('should throw if not found', async () => {
            jest.spyOn(repo, 'findOne').mockResolvedValue(null);
            await expect(service.findById('3')).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateUser', () => {
        it('should update a user', async () => {
            jest.spyOn(service, 'findById').mockResolvedValue(userArray[0] as any);
            jest.spyOn(repo, 'findOne').mockResolvedValue(null);
            jest.spyOn(repo, 'save').mockResolvedValue({ ...userArray[0], firstName: 'Updated' } as any);
            const result = await service.updateUser('1', { firstName: 'Updated' });
            expect(result.firstName).toBe('Updated');
        });
        it('should throw if email exists', async () => {
            jest.spyOn(service, 'findById').mockResolvedValue(userArray[0] as any);
            jest.spyOn(repo, 'findOne').mockResolvedValue(userArray[1] as any);
            await expect(service.updateUser('1', { email: 'b@example.com' })).rejects.toThrow(ConflictException);
        });
    });

    describe('deleteUser', () => {
        it('should remove a user', async () => {
            jest.spyOn(service, 'findById').mockResolvedValue(userArray[0] as any);
            jest.spyOn(repo, 'remove').mockResolvedValue(userArray[0] as any);
            await expect(service.deleteUser('1')).resolves.not.toThrow();
        });
    });
}); 