import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BooksService {
  constructor(private supabase: SupabaseService) {}

  async findAll(ownerId: string) {
    const { data, error } = await this.supabase.client
      .from('books')
      .select('id, title, file_path, meta, created_at')
      .eq('owner_id', ownerId);
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findOne(ownerId: string, bookId: string) {
    const { data: book, error } = await this.supabase.client
      .from('books')
      .select('id, title, file_path, meta, created_at')
      .eq('owner_id', ownerId)
      .eq('id', bookId)
      .maybeSingle();
    if (error) throw new BadRequestException(error.message);
    if (!book) throw new NotFoundException('Книга не найдена');

    // Генерируем signed URL на чтение (доступ на 1 час)
    const { data: urlData, error: urlError } =
      await this.supabase.client
        .storage
        .from('books')
        .createSignedUrl(book.file_path, 60 * 60);
    if (urlError) throw new BadRequestException(urlError.message);

    return {
      ...book,
      signedUrl: urlData.signedUrl
    };
  }

  async create(ownerId: string, file: Express.Multer.File, title: string) {
    const filename = `${ownerId}/${Date.now()}_${file.originalname}`;
    const { error: upErr } = await this.supabase.client
      .storage
      .from('books')
      .upload(filename, file.buffer, { upsert: false });
    if (upErr) throw new BadRequestException(upErr.message);

    const { data, error: dbErr } = await this.supabase.client
      .from('books')
      .insert({
        id: uuid(),
        owner_id: ownerId,
        title,
        file_path: filename,
        meta: { originalname: file.originalname }
      })
      .select()
      .single();
    if (dbErr) throw new BadRequestException(dbErr.message);
    return data;
  }
}