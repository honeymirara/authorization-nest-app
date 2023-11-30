import { UserService } from './../user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { IUser } from 'src/types/types';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(email, password) {
    try {
      const user = await this.userService.findOne(email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const passwordIsMatch = await argon2.verify(user.password, password);

      if (passwordIsMatch) {
        return user;
      } else {
        throw new UnauthorizedException('Login or password are incorrect');
      }
    } catch (error) {
      this.logger.error(`Error during user validation: ${error.message}`);
      throw new UnauthorizedException('Login or password are incorrect');
    }
  }

  async login(user: IUser) {
    try {
      const { id, email } = user;
      const token = this.jwtService.sign({ id, email });
      this.logger.log(`User ${email} logged in successfully`);
      return { id, email, token };
    } catch (error) {
      this.logger.error(`Error during user login: ${error.message}`);
      throw new UnauthorizedException('Login failed');
    }
  }
}
