import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { v4 as uuid } from 'uuid';

interface BookListItem {
    id: string;
    title: string;
    file_path: string;
    meta: any;
    created_at: string;
    progress: {
      current_page: number;
      percent: number;
      updated_at: string | null;
    }

}

@Injectable()
export class BooksService {
  constructor(private supabase: SupabaseService) {}

  async findAll(ownerId: string): Promise<BookListItem[]> {
    const { data, error } = await this.supabase.client
      .from('books')
      .select('id, title, file_path, meta, created_at, reading_progress ( current_page, percent, updated_at ) ')
      .eq('owner_id', ownerId);

    if (error) {
      throw new BadRequestException(error.message);
    }

    // Сплющиваем вложенный массив reading_progress → объект progress
    return (data as any[]).map(book => ({
      id: book.id,
      title: book.title,
      file_path: book.file_path,
      meta: book.meta,
      created_at: book.created_at,
      progress: book.reading_progress?.[0] ?? {
        current_page: 0,
        percent: 0,
        updated_at: null
      }
    }));
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