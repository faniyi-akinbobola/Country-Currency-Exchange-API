import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * Request DTO for searching countries by name
 */
export class SearchCountryDto {
  @ApiProperty({
    description: 'Country name or partial name to search for',
    example: 'united',
    minLength: 1,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;
}

/**
 * Request DTO for deleting countries by name
 */
export class DeleteCountryDto {
  @ApiProperty({
    description: 'Country name or partial name to delete',
    example: 'test',
    minLength: 1,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;
}
