import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('profile')
  async profile(@Headers('authorization') auth: string) {
    const token = auth.replace('Bearer ', '');
    const user = await this.authService.validateToken(token);
    // Возвращаем профиль
    return {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata
    };
  }
}