import { IsNotEmpty, IsNumber, IsString, IsUUID, Min, Max } from 'class-validator';

export class UpsertProgressDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  bookId!: string;

  @IsNumber()
  @Min(0, { message: 'Значение страницы не может быть отрицательным' })
  currentPage!: number;

  @IsNumber()
  @Min(0, { message: 'Процент не может быть меньше 0' })
  @Max(100, { message: 'Процент не может быть больше 100' })
  percent!: number;
}