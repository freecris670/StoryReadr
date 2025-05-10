import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { User as UserDecorator } from '../auth/user.decorator';
import type { User as SupabaseUser } from '@supabase/auth-js';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users/profile')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private users: UsersService) {}

  @Get()
  async get(@UserDecorator() user: SupabaseUser) {
    return this.users.getProfile(user.id);
  }

  @Put()
  async update(
    @UserDecorator() user: SupabaseUser,
    @Body() dto: UpdateProfileDto
  ) {
    return this.users.updateProfile(user.id, dto);
  }
}