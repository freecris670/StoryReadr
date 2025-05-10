import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class LogSessionDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  bookId!: string;

  @IsNumber()
  @Min(0, { message: 'Длительность не может быть отрицательной' })
  duration!: number;
}