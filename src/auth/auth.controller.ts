import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Logger } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    try {
      const result = await this.authService.login(req.user);
      this.logger.log(`User ${req.user.email} logged in successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Error during login: ${error.message}`);
      throw error;
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    this.logger.log(`User ${req.user.email} accessed profile`);
    return req.user;
  }
}
