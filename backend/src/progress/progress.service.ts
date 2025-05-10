import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ProgressService {
  private readonly logger = new Logger(ProgressService.name);
  
  constructor(private supabase: SupabaseService) {}

  async get(userId: string, bookId: string) {
    try {
      const { data, error } = await this.supabase.client
        .from('reading_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        this.logger.error(`Error retrieving progress: ${error.message}`);
        throw new BadRequestException(error.message);
      }
      
      return data || { current_page: 0, percent: 0 };
    } catch (error: any) {
      this.logger.error(`Unexpected error in get: ${error.message}`);
      throw error;
    }
  }

  async upsert(
    userId: string,
    bookId: string,
    current_page: number,
    percent: number
  ) {
    try {
      const { data, error } = await this.supabase.client
        .from('reading_progress')
        .upsert(
          { user_id: userId, book_id: bookId, current_page, percent },
          {
            onConflict: 'user_id,book_id', // ← здесь строка через запятую
          }
        )
        .select();
    
      if (error) {
        this.logger.error(`Error updating progress: ${error.message}`);
        throw new BadRequestException(error.message);
      }
      
      return data;
    } catch (error: any) {
      this.logger.error(`Unexpected error in upsert: ${error.message}`);
      throw error;
    }
  }
}