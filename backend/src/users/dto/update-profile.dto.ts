import { IsOptional, IsString, IsIn, IsNumber, Min } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  dailyGoal?: number;  // минуты в день

  @IsOptional()
  @IsIn(['light', 'dark'])
  theme?: 'light' | 'dark';
}