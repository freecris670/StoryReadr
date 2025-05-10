import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../auth/user.decorator';
import { User as SupabaseUser } from '@supabase/auth-js';
import { UpsertProgressDto } from './dto/upsert-progress.dto';

@Controller('progress')
@UseGuards(AuthGuard)
export class ProgressController {
  constructor(private prog: ProgressService) {}

  @Get(':bookId')
  async get(
    @User() user: SupabaseUser,
    @Param('bookId') bookId: string
  ) {
    return this.prog.get(user.id, bookId);
  }

  @Post()
  async upsert(
    @User() user: SupabaseUser,
    @Body() dto: UpsertProgressDto
  ) {
    return this.prog.upsert(
      user.id, 
      dto.bookId, 
      dto.currentPage, 
      dto.percent
    );
  }
}