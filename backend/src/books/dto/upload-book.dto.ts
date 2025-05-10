import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UploadBookDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Название книги не может быть пустым' })
  title!: string;
}