export class BookListItemDto {
    id!: string;
    title!: string;
    file_path!: string;
    meta!: any;
    created_at!: string;
    progress!: {
      current_page: number;
      percent: number;
      updated_at: string | null;
    };
  }