import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existUser) {
      this.logger.error('This user already exists');
      throw new BadRequestException('This user already exists');
    }

    const user = await this.userRepository.save({
      email: createUserDto.email,
      password: await argon2.hash(createUserDto.password),
    });

    const token = this.jwtService.sign({ email: createUserDto.email });
    this.logger.log(`User created successfully: ${user.email}`);
    return { user, token };
  }

  findAll() {
    this.logger.log('Fetching all users');
    return `This action returns all users`;
  }

  async findOne(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      this.logger.error(`User not found with email: ${email}`);
      throw new NotFoundException('User not found');
    }

    this.logger.log(`User found: ${user.email}`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    this.logger.log(`Updating user with id: ${id}`);
    return `This action updates a #${id} user`;
  }

  async updateUserPassword(email: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      this.logger.error(`User not found with email: ${email}`);
      throw new NotFoundException('User not found');
    }

    user.password = await argon2.hash(updateUserDto.password);
    await this.userRepository.save(user);

    this.logger.log(`Password updated successfully for user: ${user.email}`);
    return { message: 'Password updated successfully' };
  }
}


