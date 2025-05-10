import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private config: ConfigService) {
    const url = this.config.get<string>('SUPABASE_URL');
    const key = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) {
      throw new InternalServerErrorException(
        'Не заданы переменные SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY',
      );
    }
    this.supabase = createClient(url, key);
  }

  get client(): SupabaseClient {
    return this.supabase;
  }
}