import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login() {
    return 'login';
  }

  @Post('register')
  async register() {
    return 'register';
  }

  @Post('find-password')
  async findPassword() {
    return 'find-password';
  }

  @Post('change-password')
  async changePassword() {
    return 'change-password';
  }
}
