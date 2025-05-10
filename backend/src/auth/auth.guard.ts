import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request } from 'express';
import type { User as SupabaseUser } from '@supabase/auth-js';

interface AuthRequest extends Request {
  user: SupabaseUser;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<AuthRequest>();

    // 1) Берём access_token из Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }
    const accessToken = authHeader.replace(/^Bearer\s+/i, '').trim();

    // 2) Берём refresh_token из хедера x-refresh-token
    const refreshHeader = req.headers['x-refresh-token'];
    if (!refreshHeader || Array.isArray(refreshHeader)) {
      throw new UnauthorizedException('Missing refresh token header');
    }
    const refreshToken = refreshHeader.replace(/^Bearer\s+/i, '').trim();

    // 3) Валидируем оба токена
    const user = await this.authService.validateToken(accessToken, refreshToken);

    // 4) Прокидываем пользователя в запрос
    req.user = user;

    return true;
  }
}