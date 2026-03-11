import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateTripDto {
  @ApiProperty({ example: 'Japan 2026' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Cherry blossom season trip', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2026-04-01', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ example: '2026-04-15', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
