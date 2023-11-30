import { Controller, Get, Post, Body, ValidationPipe, UsePipes, Patch, Param, UseGuards, Delete, Req, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  private readonly logger = new Logger('UserController');

  constructor(private readonly userService: UserService) { }

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    try {
      const result = this.userService.create(createUserDto);
      this.logger.log('User created successfully');
      return result;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Get()
  findAll() {
    this.logger.log('Fetching all users');
    return this.userService.findAll();
  }

  @Get(':email')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('email') email: string) {
    try {
      const result = this.userService.findOne(email);
      this.logger.log(`User found: ${email}`);
      return result;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Patch(':email')
  @UseGuards(JwtAuthGuard)
  updateUserPassword(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const result = this.userService.updateUserPassword(email, updateUserDto);
      this.logger.log(`Password updated successfully for user: ${email}`);
      return result;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
