import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { User } from '@supabase/auth-js';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
  * GET /auth/profile
  * Заголовки:
  *   Authorization: Bearer <access_token>
  *   x-refresh-token: <refresh_token>
  */

  @Get('profile')
  async profile(
    @Headers('authorization') authHeader?: string,
    @Headers('x-refresh-token') refreshHeader?: string  
  ) {
    if (!authHeader || !refreshHeader) {
      throw new UnauthorizedException('Missing authentication headers');
    }

    // Чистим префикс Bearer
    const accessToken = authHeader.replace(/^Bearer\s+/i, '').trim();
    const refreshToken = refreshHeader.replace(/^Bearer\s+/i, '').trim();

    // Валидируем в AuthService
    const user: User = await this.authService.validateToken(accessToken, refreshToken);
    
    // Возвращаем профиль
    return {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata
    };
  }
}