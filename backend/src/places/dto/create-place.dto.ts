import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreatePlaceDto {
  @ApiProperty({ example: 'Fushimi Inari Shrine' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Famous shrine with thousands of torii gates',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Kyoto, Japan', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: '2026-04-03', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;
}
