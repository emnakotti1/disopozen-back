import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from '../entities/user.entity';
import { UpdateUserDto } from '../auth/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find();
    return users.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword,
    );
  }

  // Retrieves a user by ID, excluding the password field
  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if email is being updated and if it's already in use
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    // Update user properties
    Object.assign(user, updateUserDto);
    if (updateUserDto.address !== undefined) {
      user.address = updateUserDto.address;
    }

    const updatedUser = await this.userRepository.save(user);
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.remove(user);
  }
  async findProviders(pagination: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{ data: Partial<User>[]; total: number }> {
    const { page, limit, search } = pagination;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.phoneNumber',
        'user.address',
        'user.imageUrl',
        'user.postalCode',
        'user.city',
        'user.email',
      ])
      .where('user.role = :role', { role: Role.PROVIDER });

    // Add search functionality if search parameter is provided
    if (search?.trim()) {
      queryBuilder.andWhere(
        "(LOWER(user.firstName) LIKE LOWER(:search) OR LOWER(user.lastName) LIKE LOWER(:search) OR LOWER(CONCAT(user.firstName, ' ', user.lastName)) LIKE LOWER(:search))",
        { search: `%${search.trim()}%` },
      );
    }

    const [result, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: result,
      total,
    };
  }
}
