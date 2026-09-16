import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth-dto.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: AuthDto) {
    return this.authService.createUser(dto);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    const user = await this.authService.validateUser(dto);

    return this.authService.login(user.email);
  }
}
