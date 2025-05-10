import { 
  Controller, Get, Post, Param, Body, UploadedFile, UseInterceptors, UseGuards, BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { BooksService } from './books.service';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../auth/user.decorator';
import type { User as SupabaseUser } from '@supabase/auth-js';
import { UploadBookDto } from './dto/upload-book.dto';
import type { Express } from 'express';

@Controller('books')
@UseGuards(AuthGuard)
export class BooksController {
  constructor(private books: BooksService) {}

  @Get()
  async list(@User() user: SupabaseUser) {
    return this.books.findAll(user.id);
  }

  @Get(':id')
  async findOne(
    @User() user: SupabaseUser,
    @Param('id') id: string
  ) {
    const book = await this.books.findOne(user.id, id);
    if (!book) throw new BadRequestException('Книга не найдена');
    return book;
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 50 * 1024 * 1024 } // до 50 Мб
    })
  )
  async upload(
    @User() user: SupabaseUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadBookDto
  ) {
    if (!file) throw new BadRequestException('Файл не передан');
    return this.books.create(user.id, file, dto.title);
  }
}