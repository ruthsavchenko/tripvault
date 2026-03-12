import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export const EXPENSE_CATEGORIES = [
  'accommodation',
  'transport',
  'food',
  'activities',
  'other',
] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export class CreateExpenseDto {
  @ApiProperty({ example: 'Hotel Gracery Shinjuku' })
  @IsString()
  title: string;

  @ApiProperty({ example: 250.0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @ApiProperty({ example: 'accommodation', enum: EXPENSE_CATEGORIES })
  @IsEnum(EXPENSE_CATEGORIES)
  category: ExpenseCategory;

  @ApiProperty({ example: '2026-04-01', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;
}
