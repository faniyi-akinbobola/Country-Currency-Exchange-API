import {
  Controller,
  Get,
  Post,
  Query,
  Delete,
  Param,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiProduces,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiServiceUnavailableResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CountriesService } from './countries.service';
import {
  CountryDto,
  RefreshResponseDto,
  StatusResponseDto,
  DeleteResponseDto,
  ErrorResponseDto,
  SearchCountryDto,
  DeleteCountryDto,
} from './dto';
import type { Response } from 'express';
import * as fs from 'fs-extra';

@ApiTags('Countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh countries data from external APIs',
    description:
      'Fetches fresh country data from RestCountries API and Exchange Rate API, ' +
      'calculates estimated GDP using the formula: population × random(1000-2000) ÷ exchange_rate, ' +
      'and updates the database. Each refresh generates new random multipliers for GDP calculations.',
  })
  @ApiResponse({
    status: 200,
    description: 'Countries data refreshed successfully',
    type: RefreshResponseDto,
    schema: {
      example: {
        success: true,
        message: 'Countries data refreshed successfully',
        timestamp: '2024-10-28T20:30:00.000Z',
      },
    },
  })
  @ApiServiceUnavailableResponse({
    description: 'External API services are unavailable',
    type: ErrorResponseDto,
    schema: {
      example: {
        error: 'External data source unavailable',
        details: 'Could not fetch data from RestCountries API',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during processing',
  })
  async refreshCountries() {
    try {
      console.log('🎯 Controller: refresh endpoint called');
      await this.countriesService.refreshCountriesandSave();
      return {
        success: true,
        message: 'Countries data refreshed successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('❌ Controller Error:', error.message);
      console.error('❌ Controller Stack:', error.stack);

      // Handle external API errors
      if (error.name === 'ExternalAPIError' || error.statusCode === 503) {
        throw new HttpException(
          {
            error: 'External data source unavailable',
            details: error.details || 'Could not fetch data from external API',
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      throw error;
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get all countries',
    description:
      'Retrieves all countries stored in the database with complete information including ' +
      'name, capital, region, population, currency, exchange rates, and calculated GDP estimates.',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of all countries with complete data',
    type: [CountryDto],
    schema: {
      example: [
        {
          id: 1,
          name: 'United Kingdom',
          capital: 'London',
          region: 'Europe',
          population: 67886011,
          flag: 'https://flagcdn.com/w320/gb.png',
          currency: 'GBP',
          exchange_rate: 1.25,
          estimated_gbp: 81463213.6,
          created_at: '2024-10-28T20:30:00.000Z',
          updated_at: '2024-10-28T20:30:00.000Z',
        },
      ],
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Database connection or server error',
  })
  findAllCountries() {
    return this.countriesService.findAllCountries();
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search countries by name',
    description:
      'Search for countries by name using case-insensitive partial matching. ' +
      'Returns all countries whose names contain the provided search term. ' +
      'Minimum search term length is 1 character.',
  })
  @ApiQuery({
    name: 'name',
    description:
      'Country name or partial name to search for (minimum 1 character)',
    example: 'united',
    required: true,
    type: String,
    minLength: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Array of countries matching the search criteria',
    type: [CountryDto],
    schema: {
      example: [
        {
          id: 1,
          name: 'United Kingdom',
          capital: 'London',
          region: 'Europe',
          population: 67886011,
          flag: 'https://flagcdn.com/w320/gb.png',
          currency: 'GBP',
          exchange_rate: 1.25,
          estimated_gbp: 81463213.6,
          created_at: '2024-10-28T20:30:00.000Z',
          updated_at: '2024-10-28T20:30:00.000Z',
        },
        {
          id: 2,
          name: 'United States',
          capital: 'Washington, D.C.',
          region: 'Americas',
          population: 331002651,
          flag: 'https://flagcdn.com/w320/us.png',
          currency: 'USD',
          exchange_rate: 1.0,
          estimated_gbp: 496503976.5,
          created_at: '2024-10-28T20:30:00.000Z',
          updated_at: '2024-10-28T20:30:00.000Z',
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'Invalid search parameters - name is required and must be at least 1 character',
    schema: {
      example: { error: 'Validation failed' },
    },
  })
  @ApiNotFoundResponse({
    description: 'No countries found matching the search criteria',
    schema: {
      example: { error: 'Country not found' },
    },
  })
  async findCountriesByName(@Query('name') name: string) {
    try {
      return await this.countriesService.findCountriesByName(name);
    } catch (error) {
      if (error.name === 'ValidationError' || error.statusCode === 400) {
        throw new HttpException(
          { error: 'Validation failed' },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (error.name === 'NotFoundError' || error.statusCode === 404) {
        throw new HttpException(
          { error: 'Country not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      throw error;
    }
  }

  /**
   * Delete countries by name
   *
   * Performs a case-insensitive partial match deletion on country names.
   * Removes all countries whose names contain the search term.
   */
  @Delete('delete')
  @ApiOperation({
    summary: 'Delete countries by name',
    description:
      'Delete countries by name using case-insensitive partial matching. ' +
      'Removes all countries whose names contain the provided search term from the database. ' +
      'This action is irreversible and will permanently remove matching records.',
  })
  @ApiQuery({
    name: 'name',
    description: 'Country name or partial name to delete (minimum 1 character)',
    example: 'test',
    required: true,
    type: String,
    minLength: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Countries successfully deleted from the database',
    schema: {
      example: {
        message: 'Deleted 2 countries matching "test"',
        deletedCount: 2,
        deletedCountries: [
          {
            id: 15,
            name: 'Test Country 1',
            capital: 'Test Capital',
            region: 'Test Region',
            population: 1000000,
            flag: 'https://example.com/flag.png',
            currency: 'TST',
            exchange_rate: 1.0,
            estimated_gbp: 15000000.0,
          },
          {
            id: 16,
            name: 'Another Test',
            capital: 'Another Capital',
            region: 'Another Region',
            population: 2000000,
            flag: 'https://example.com/flag2.png',
            currency: 'AST',
            exchange_rate: 0.8,
            estimated_gbp: 24000000.0,
          },
        ],
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      'Invalid parameters - name is required and must be at least 1 character',
    schema: {
      example: { error: 'Validation failed' },
    },
  })
  @ApiNotFoundResponse({
    description: 'No countries found matching the search criteria',
    schema: {
      example: { error: 'Country not found' },
    },
  })
  async deleteCountriesByName(@Query('name') name: string) {
    try {
      return await this.countriesService.deleteCountriesByName(name);
    } catch (error) {
      if (error.name === 'ValidationError' || error.statusCode === 400) {
        throw new HttpException(
          { error: 'Validation failed' },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (error.name === 'NotFoundError' || error.statusCode === 404) {
        throw new HttpException(
          { error: 'Country not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      throw error;
    }
  }

  /**
   * Get database status and statistics
   *
   * Provides comprehensive statistics about the countries database including
   * total counts, data completeness, and aggregate calculations.
   */
  @Get('status')
  @ApiOperation({
    summary: 'Get database status and statistics',
    description:
      'Retrieves comprehensive statistics about the countries database including ' +
      'total country count, data completeness metrics, average exchange rates, ' +
      'total estimated GDP in GBP, regional distribution, and currency information.',
  })
  @ApiResponse({
    status: 200,
    description: 'Database status and statistics retrieved successfully',
    schema: {
      example: {
        totalCountries: 195,
        dataCompleteness: {
          withExchangeRates: 180,
          withoutExchangeRates: 15,
          completenessPercentage: 92.31,
        },
        statistics: {
          averagePopulation: 39650000,
          totalEstimatedGDP: 89750000000.5,
          averageExchangeRate: 0.85,
          medianExchangeRate: 0.75,
        },
        regionalDistribution: {
          Europe: 44,
          Asia: 50,
          Africa: 54,
          Americas: 35,
          Oceania: 12,
        },
        currencies: {
          uniqueCurrencies: 168,
          mostCommon: ['USD', 'EUR', 'GBP'],
          rarest: ['KPW', 'IRR', 'VES'],
        },
        lastUpdated: '2024-10-28T20:30:00.000Z',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while retrieving database statistics',
    schema: {
      example: { error: 'Database connection failed' },
    },
  })
  getCountriesStatus() {
    return this.countriesService.getCountriesStatus();
  }

  /**
   * Generate and serve country summary image
   *
   * Creates an SVG-based summary image containing key statistics about all countries
   * in the database and serves it as a PNG image. The image is cached and regenerated
   * when data changes.
   */
  @Get('image')
  @ApiOperation({
    summary: 'Generate and download country summary image',
    description:
      'Generates and serves a visual summary image (PNG format) containing key statistics ' +
      'about all countries in the database. The image includes total counts, regional distribution, ' +
      'currency information, and aggregate calculations. Image is dynamically generated and cached for performance.',
  })
  @ApiProduces('image/png')
  @ApiResponse({
    status: 200,
    description: 'Summary image generated and served successfully as PNG',
    content: {
      'image/png': {
        schema: {
          type: 'string',
          format: 'binary',
          description: 'PNG image file containing visual database statistics',
        },
        example:
          'Binary PNG image data containing country statistics visualization',
      },
    },
    headers: {
      'Content-Type': {
        description: 'MIME type of the response',
        schema: { type: 'string', example: 'image/png' },
      },
      'Content-Disposition': {
        description: 'File download information',
        schema: {
          type: 'string',
          example: 'attachment; filename="country-summary.png"',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Summary image could not be generated due to missing data',
    schema: {
      example: { error: 'No countries found to generate image' },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during image generation or processing',
    schema: {
      example: { error: 'Image generation failed' },
    },
  })
  async getCountryImage(@Res() res: Response) {
    try {
      const result = await this.countriesService.getCountryImage();

      if ('error' in result) {
        return res.status(HttpStatus.NOT_FOUND).json({
          error: result.error,
        });
      }

      // Check if file exists and serve it
      const exists = await fs.pathExists(result.imagePath);
      if (!exists) {
        return res.status(HttpStatus.NOT_FOUND).json({
          error: 'Summary image not found',
        });
      }

      // Set proper headers for image
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes

      // Stream the file
      const fileStream = fs.createReadStream(result.imagePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error('Error serving country image:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Internal server error',
      });
    }
  }
}
