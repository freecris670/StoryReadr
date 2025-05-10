import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    // грузим .env и делаем ConfigService глобальным
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule,
    AuthModule,
  ],
})
export class AppModule {}