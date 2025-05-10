import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import type { User } from '@supabase/auth-js';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  /**
   * Валидация сессии Supabase по access + refresh токенам.
   * @ param accessToken - текущий access_token из клиента
   * @ param refreshToken - refresh_token из клиента
   */  

  async validateToken(accessToken: string, refreshToken: string): Promise<User> {
    // Восстанавливаем сессию в клиенте
    const { data: sessionData, error: sessErr } =
      await this.supabaseService.client.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

    if (sessErr || !sessionData.session) {
      throw new UnauthorizedException('Invalid auth session');
    }

    const { data: userData, error: userErr } = await this.supabaseService.client.auth.getUser();

    if (userErr || !userData.user) {
      throw new UnauthorizedException('Cannot retrieve user');
    }
    
    return userData.user;
  }
}