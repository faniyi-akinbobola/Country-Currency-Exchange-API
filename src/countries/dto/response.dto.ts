import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsNumber, IsOptional } from 'class-validator';

/**
 * Response DTO for successful country refresh operation
 */
export class RefreshResponseDto {
  @ApiProperty({
    description: 'Indicates if the operation was successful',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  success: boolean;

  @ApiProperty({
    description: 'Human-readable message describing the result',
    example: 'Countries data refreshed successfully',
    type: String,
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'ISO timestamp when the operation completed',
    example: '2024-01-15T10:30:00.000Z',
    type: String,
  })
  @IsString()
  timestamp: string;
}

/**
 * Response DTO for countries status endpoint
 */
export class StatusResponseDto {
  @ApiProperty({
    description: 'Total number of countries in the database',
    example: 195,
    type: Number,
  })
  total_countries: number;

  @ApiProperty({
    description:
      'Number of countries with complete data (all fields populated)',
    example: 180,
    type: Number,
  })
  countries_with_data: number;

  @ApiProperty({
    description: 'Number of countries missing some data fields',
    example: 15,
    type: Number,
  })
  countries_missing_data: number;

  @ApiProperty({
    description: 'Average exchange rate across all countries',
    example: 1.2345,
    type: Number,
    format: 'decimal',
  })
  average_exchange_rate: number;

  @ApiProperty({
    description: 'Total estimated GDP in GBP for all countries combined',
    example: 987654321.5,
    type: Number,
    format: 'decimal',
  })
  total_estimated_gbp: number;

  @ApiProperty({
    description: 'ISO timestamp when the status was generated',
    example: '2024-01-15T10:30:00.000Z',
    type: String,
  })
  last_updated: string;
}

/**
 * Response DTO for delete operations
 */
export class DeleteResponseDto {
  @ApiProperty({
    description: 'Indicates if the deletion was successful',
    example: true,
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    description: 'Human-readable message describing the result',
    example: 'Country deleted successfully',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Number of records affected by the deletion',
    example: 1,
    type: Number,
  })
  affected: number;
}

/**
 * Error response DTO for various error scenarios
 */
export class ErrorResponseDto {
  @ApiProperty({
    description: 'Error type or category',
    example: 'Country not found',
    type: String,
  })
  error: string;

  @ApiProperty({
    description: 'Additional error details (optional)',
    example: 'Could not fetch data from RestCountries API',
    type: String,
    required: false,
  })
  details?: string;
}

/**
 * Image response information DTO
 */
export class ImageInfoDto {
  @ApiProperty({
    description: 'Path to the generated image file',
    example: '/path/to/country-summary.png',
    type: String,
  })
  imagePath: string;

  @ApiProperty({
    description: 'Timestamp when the image was generated',
    example: '2024-01-15T10:30:00.000Z',
    type: String,
  })
  generatedAt: string;
}
