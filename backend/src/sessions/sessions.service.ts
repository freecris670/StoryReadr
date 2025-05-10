import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);
  
  constructor(private supabase: SupabaseService) {}

  /**
   * Логирует сессию чтения, начисляет XP и обновляет уровень пользователя.
   * @param userId 
   * @param bookId 
   * @param durationMin длительность в минутах
   */
  async logSession(userId: string, bookId: string, durationMin: number) {
    try {
      // начисляем XP равное времени чтения
      const xpEarned = Math.floor(durationMin);

      // сохраняем в таблицу reading_sessions
      const { data: sessionData, error: sessErr } =
        await this.supabase.client
          .from('reading_sessions')
          .insert({
            user_id: userId,
            book_id: bookId,
            duration: durationMin,
            xp_earned: xpEarned
          })
          .select()
          .single();
          
      if (sessErr) {
        this.logger.error(`Error logging session: ${sessErr.message}`);
        throw new BadRequestException(sessErr.message);
      }

      // Получаем текущие метаданные пользователя
      const { data: userRes, error: getErr } =
        await this.supabase.client.auth.admin.getUserById(userId);
        
      if (getErr || !userRes.user) {
        this.logger.error(`Error retrieving user: ${getErr?.message || 'User not found'}`);
        throw new BadRequestException('Не удалось получить профиль пользователя');
      }
      
      const meta = userRes.user.user_metadata || {};
      const currentXp = typeof meta.xp === 'number' ? meta.xp : 0;
      const currentLevel = typeof meta.level === 'number' ? meta.level : 1;

      const newXp = currentXp + xpEarned;
      // простая формула: каждые 100 XP — новый уровень
      const newLevel = Math.floor(newXp / 100) + 1;

      // обновляем user_metadata
      const { error: updErr } =
        await this.supabase.client.auth.admin.updateUserById(userId, {
          user_metadata: { xp: newXp, level: newLevel }
        });
        
      if (updErr) {
        this.logger.error(`Error updating user metadata: ${updErr.message}`);
        throw new BadRequestException(updErr.message);
      }

      return { session: sessionData, xp: newXp, level: newLevel };
    } catch (error: any) {
      this.logger.error(`Unexpected error in logSession: ${error.message}`);
      throw error;
    }
  }
}