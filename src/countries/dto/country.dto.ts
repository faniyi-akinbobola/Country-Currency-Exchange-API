import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsDate, IsUrl } from 'class-validator';

/**
 * Data Transfer Object representing a Country entity
 */
export class CountryDto {
  @ApiProperty({
    description: 'Unique identifier of the country',
    example: 1,
    type: Number,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Name of the country',
    example: 'United Kingdom',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Capital city of the country',
    example: 'London',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  capital?: string;

  @ApiProperty({
    description: 'Geographic region where the country is located',
    example: 'Europe',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiProperty({
    description: 'Total population of the country',
    example: 67886011,
    type: Number,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  population?: number;

  @ApiProperty({
    description: 'URL to the country flag image',
    example: 'https://flagcdn.com/w320/gb.png',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsUrl()
  flag?: string;

  @ApiProperty({
    description: 'Primary currency code used in the country',
    example: 'GBP',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    description: 'Current exchange rate to USD',
    example: 1.25,
    type: Number,
    format: 'decimal',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  exchange_rate?: number;

  @ApiProperty({
    description:
      'Estimated GDP in GBP calculated using population and random multiplier',
    example: 1356720138.5,
    type: Number,
    format: 'decimal',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  estimated_gbp?: number;

  @ApiProperty({
    description: 'Timestamp when the record was created',
    example: '2024-01-15T10:30:00.000Z',
    type: Date,
  })
  @IsDate()
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp when the record was last updated',
    example: '2024-01-15T14:45:30.000Z',
    type: Date,
  })
  @IsDate()
  updated_at: Date;
}
