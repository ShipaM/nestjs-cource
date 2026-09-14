import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth-dto.js';

@Controller('auth')
export class AuthController {
  @Post('register')
  async register(@Body() dto: AuthDto) {
    return {
      message: 'Registration',
    };
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    return {
      message: 'Login',
    };
  }
}
