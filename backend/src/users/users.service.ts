import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import type { User } from '@supabase/auth-js';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private supabase: SupabaseService) {}

  async getProfile(userId: string) {
    const { data: userRes, error } = 
      await this.supabase.client.auth.admin.getUserById(userId);
    if (error || !userRes.user) {
      throw new BadRequestException(error?.message || 'User not found');
    }
    // Вся metadata
    return userRes.user.user_metadata || {};
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    // Получаем текущее metadata
    const current = await this.getProfile(userId);
    const newMeta = { ...current, ...dto };

    const { error } =
      await this.supabase.client.auth.admin.updateUserById(userId, {
        user_metadata: newMeta
      });
    if (error) {
      throw new BadRequestException(error.message);
    }
    return newMeta;
  }
}