import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../auth/user.decorator';
import type { User as SupabaseUser } from '@supabase/auth-js';
import { LogSessionDto } from './dto/log-session.dto';

@Controller('sessions')
@UseGuards(AuthGuard)
export class SessionsController {
  constructor(private sessions: SessionsService) {}

  @Post()
  async log(
    @User() user: SupabaseUser,
    @Body() dto: LogSessionDto
  ) {
    return this.sessions.logSession(user.id, dto.bookId, dto.duration);
  }
}