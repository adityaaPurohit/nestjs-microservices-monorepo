import {
    Injectable,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@database/entities/user.entity';
import { UserRole } from '@common/enums/user-roles.enum';
import { ResponseMessages } from '@common/constants/response-messages';
import { PaginationUtil } from '@common/utils/pagination.util';
import { PaginationOptions } from '@common/interfaces/pagination.interface';
import { CreateUserDto, UpdateUserDto } from '@common/dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.userRepository.findOne({
            where: { email: createUserDto.email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const user = this.userRepository.create({
            ...createUserDto,
            role: createUserDto.role || UserRole.VIEWER,
        });

        return this.userRepository.save(user);
    }

    async findById(id: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException(ResponseMessages.NOT_FOUND);
        }

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { email },
        });
    }

    async findAll(options: PaginationOptions = {}) {
        const normalizedOptions = PaginationUtil.validateAndNormalize(options);
        const skip = PaginationUtil.getSkipValue(
            normalizedOptions.page,
            normalizedOptions.limit,
        );
        const take = PaginationUtil.getTakeValue(normalizedOptions.limit);

        const [users, total] = await this.userRepository.findAndCount({
            skip,
            take,
            order: {
                [normalizedOptions.sortBy]: normalizedOptions.sortOrder,
            },
        });

        return PaginationUtil.createPaginationResponse(
            users,
            total,
            normalizedOptions,
        );
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findById(id);

        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.findByEmail(updateUserDto.email);
            if (existingUser) {
                throw new ConflictException('User with this email already exists');
            }
        }

        Object.assign(user, updateUserDto);
        return this.userRepository.save(user);
    }

    async deleteUser(id: string): Promise<void> {
        const user = await this.findById(id);
        await this.userRepository.remove(user);
    }

    async updateUserRole(id: string, role: UserRole): Promise<User> {
        const user = await this.findById(id);
        user.role = role;
        return this.userRepository.save(user);
    }
}
