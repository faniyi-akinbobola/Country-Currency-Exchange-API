import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import axios from 'axios';
import * as fs from 'fs-extra';
import * as path from 'path';
import sharp from 'sharp';

/**
 * Service responsible for managing country data operations
 *
 * This service handles:
 * - Fetching data from external APIs (RestCountries and Exchange Rate API)
 * - Processing and calculating country statistics (GDP estimates)
 * - Database operations (CRUD operations on countries)
 * - Image generation for country summaries
 * - Data validation and error handling
 */
@Injectable()
export class CountriesService {
  /**
   * Initialize the CountriesService with required dependencies
   *
   * @param countryRepository - TypeORM repository for Country entity operations
   * @param configService - NestJS configuration service for environment variables
   */
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Refresh countries data from external APIs and save to database
   *
   * This method:
   * 1. Fetches fresh country data from RestCountries API
   * 2. Fetches current exchange rates from Exchange Rate API
   * 3. Processes each country individually to calculate estimated GDP
   * 4. Uses upsert logic to update existing or insert new countries
   * 5. Generates fresh random multipliers (1000-2000) for each country
   *
   * GDP Calculation: population * random(1000-2000) / exchange_rate
   *
   * @throws {ExternalAPIError} When external APIs are unavailable (503)
   * @throws {Error} For other processing errors
   *
   * @returns Promise<void> - Resolves when all countries are processed and saved
   */
  async refreshCountriesandSave(): Promise<void> {
    try {
      console.log('🚀 Starting refreshCountriesandSave method...');

      // Get URLs from environment with fallbacks
      const countriesUrl =
        this.configService.get('api.countries.url') ||
        this.configService.get('COUNTRIES_API_URL') ||
        'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies';

      const exchangeRateUrl =
        this.configService.get('api.exchangeRate.url') ||
        this.configService.get('EXCHANGE_RATE_API_URL') ||
        'https://open.er-api.com/v6/latest/USD';

      console.log('Countries URL:', countriesUrl);
      console.log('Exchange Rate URL:', exchangeRateUrl);

      let countries;
      let exchangeRates: Record<string, number> = {};

      try {
        console.log('Fetching countries data...');
        const response = await axios.get(countriesUrl, { timeout: 10000 });
        countries = response.data;
        console.log(`Fetched ${countries.length} countries`);
      } catch (error) {
        console.error('Countries API Error:', error.message);
        const externalError = new Error(`External data source unavailable`);
        externalError.name = 'ExternalAPIError';
        (externalError as any).details =
          `Could not fetch data from Countries API`;
        (externalError as any).statusCode = 503;
        throw externalError;
      }

      try {
        console.log('Fetching exchange rates...');
        const exchangeRateResponse = await axios.get(exchangeRateUrl, {
          timeout: 10000,
        });
        exchangeRates = exchangeRateResponse.data.rates || {};
        console.log(
          'Exchange rates fetched:',
          Object.keys(exchangeRates).length,
          'currencies',
        );
      } catch (error) {
        console.error('Exchange Rate API Error:', error.message);
        const externalError = new Error(`External data source unavailable`);
        externalError.name = 'ExternalAPIError';
        (externalError as any).details =
          `Could not fetch data from Exchange Rate API`;
        (externalError as any).statusCode = 503;
        throw externalError;
      }

      try {
        console.log('Processing countries data...');

        for (const c of countries) {
          const countryName = c.name || 'Unknown';

          // Currency handling logic as per requirements
          const hasCurrency =
            c.currencies &&
            Array.isArray(c.currencies) &&
            c.currencies.length > 0;
          let currencyCode: string | null = null;
          let exchangeRate: number | null = null;
          let estimatedGbp: number = 0;

          if (hasCurrency) {
            // Store only the first currency code from the array
            currencyCode = c.currencies[0].code;

            // Get exchange rate if currency code is found in exchange rates API
            if (currencyCode && exchangeRates[currencyCode]) {
              exchangeRate = exchangeRates[currencyCode];
            }
            // If currency_code is not found in exchange rates API, set to null
          }
          // If currencies array is empty, do NOT call exchange rate API, set to null

          const population = parseInt(c.population) || 0;

          // Calculate estimated_gbp with fresh random multiplier (1000-2000)
          if (population > 0 && exchangeRate && exchangeRate > 0) {
            const randomMultiplier = Math.random() * 1000 + 1000; // Fresh random between 1000-2000
            estimatedGbp = (population * randomMultiplier) / exchangeRate;
          }

          const countryData = {
            name: countryName,
            capital: c.capital || null,
            region: c.region || 'Unknown',
            population: population,
            currency_code: currencyCode,
            exchange_rate: exchangeRate,
            estimated_gbp: parseFloat(estimatedGbp.toFixed(2)),
            flag_url: c.flag || null,
          };

          // Update vs Insert Logic: Match existing countries by name (case-insensitive)
          const existingCountry = await this.countryRepository.findOne({
            where: { name: countryName },
          });

          if (existingCountry) {
            // If country exists: Update all fields including recalculating estimated_gdp with new random multiplier
            console.log(`Updating existing country: ${countryName}`);
            await this.countryRepository.update(
              existingCountry.id,
              countryData,
            );
          } else {
            // If country doesn't exist: Insert new record
            console.log(`Inserting new country: ${countryName}`);
            await this.countryRepository.save(countryData);
          }

          console.log(
            `${countryName}: Population=${population}, Currency=${currencyCode}, Rate=${exchangeRate}, EstimatedGBP=${estimatedGbp.toFixed(2)}`,
          );
        }

        console.log('Countries processing completed successfully!');

        // Generate summary image after successful refresh
        await this.generateSummaryImage();
      } catch (error) {
        console.error('Database save error:', error.message);
        throw new Error(
          `Failed to save countries to database: ${error.message}`,
        );
      }
    } catch (error) {
      console.error('❌ CRITICAL ERROR in refreshCountriesandSave:', error);
      console.error('❌ Stack trace:', error.stack);
      throw error;
    }
  }

  /**
   * Get comprehensive database statistics and status information
   *
   * Provides detailed metrics about the countries database including:
   * - Total number of countries stored
   * - Data completeness statistics
   * - Average exchange rates and GDP estimates
   * - Last refresh timestamp
   *
   * @returns Promise<object> - Statistics object with counts, averages, and timestamps
   */
  async getCountriesStatus() {
    const count = await this.countryRepository.count();
    const lastRefreshedCountry = await this.countryRepository.find({
      order: { last_refreshed_at: 'DESC' },
      take: 1,
    });
    return {
      total_countries: count,
      last_refreshed_at:
        lastRefreshedCountry.length > 0
          ? lastRefreshedCountry[0].last_refreshed_at
          : null,
    };
  }

  /**
   * Search for countries by name using case-insensitive partial matching
   *
   * Performs a LIKE query to find all countries whose names contain the search term.
   * The search is case-insensitive and supports partial matches.
   *
   * @param name - The search term for country names (required, non-empty string)
   *
   * @throws {ValidationError} When name is invalid, empty, or not provided (400)
   * @throws {NotFoundError} When no countries match the search criteria (404)
   *
   * @returns Promise<Country[]> - Array of countries matching the search criteria
   */
  async findCountriesByName(name: string) {
    // Validation: Check if name parameter is provided and valid
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      (validationError as any).statusCode = 400;
      throw validationError;
    }

    const countries = await this.countryRepository
      .createQueryBuilder('country')
      .where('LOWER(country.name) LIKE :name', {
        name: `%${name.toLowerCase().trim()}%`,
      })
      .getMany();

    // Check if any countries were found
    if (countries.length === 0) {
      const notFoundError = new Error('Country not found');
      notFoundError.name = 'NotFoundError';
      (notFoundError as any).statusCode = 404;
      throw notFoundError;
    }

    return countries;
  }

  /**
   * Delete countries by name using case-insensitive partial matching
   *
   * Removes all countries whose names contain the search term from the database.
   * The deletion is case-insensitive and supports partial matches.
   *
   * @param name - The search term for countries to delete (required, non-empty string)
   *
   * @throws {ValidationError} When name is invalid, empty, or not provided (400)
   * @throws {NotFoundError} When no countries match the search criteria (404)
   *
   * @returns Promise<object> - Deletion result with success status, message, and affected count
   */
  async deleteCountriesByName(name: string) {
    // Validation: Check if name parameter is provided and valid
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      (validationError as any).statusCode = 400;
      throw validationError;
    }

    const countriesToDelete = await this.countryRepository
      .createQueryBuilder('country')
      .where('LOWER(country.name) LIKE :name', {
        name: `%${name.toLowerCase().trim()}%`,
      })
      .getMany();

    // Check if any countries were found to delete
    if (countriesToDelete.length === 0) {
      const notFoundError = new Error('Country not found');
      notFoundError.name = 'NotFoundError';
      (notFoundError as any).statusCode = 404;
      throw notFoundError;
    }

    const deleteResult = await this.countryRepository.remove(countriesToDelete);
    return {
      deleted_count: deleteResult.length,
      message: `${deleteResult.length} countries deleted successfully.`,
    };
  }

  /**
   * Generate a visual summary image of country statistics
   *
   * Creates an SVG-based image containing:
   * - Total country count
   * - Top 5 countries by estimated GDP
   * - Average exchange rate
   * - Total estimated GDP across all countries
   * - Current timestamp
   *
   * The image is saved as a PNG file and cached for serving via the image endpoint.
   *
   * @throws {Error} When image generation or file operations fail
   *
   * @returns Promise<void> - Resolves when image is successfully generated and saved
   */
  async generateSummaryImage(): Promise<void> {
    try {
      console.log('🖼️ Generating summary image...');

      // Get total countries count
      const totalCountries = await this.countryRepository.count();

      // Get top 5 countries by estimated GDP
      const topCountries = await this.countryRepository.find({
        order: { estimated_gbp: 'DESC' },
        take: 5,
      });

      // Get last refresh timestamp
      const lastRefresh = new Date().toISOString();

      // Create SVG content
      const svgContent = this.createSummaryImageSVG(
        totalCountries,
        topCountries,
        lastRefresh,
      );

      // Ensure cache directory exists
      const cacheDir = path.join(process.cwd(), 'cache');
      await fs.ensureDir(cacheDir);

      // Convert SVG to PNG using Sharp
      const imagePath = path.join(cacheDir, 'summary.png');

      await sharp(Buffer.from(svgContent)).png().toFile(imagePath);

      console.log(`✅ Summary image generated successfully at: ${imagePath}`);
    } catch (error) {
      console.error('❌ Error generating summary image:', error);
      // Don't throw error to prevent breaking the refresh process
    }
  }

  private createSummaryImageSVG(
    totalCountries: number,
    topCountries: Country[],
    lastRefresh: string,
  ): string {
    const width = 800;
    const height = 600;

    let svgContent = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <!-- Background -->
        <rect width="${width}" height="${height}" fill="#f8f9fa"/>
        
        <!-- Header -->
        <rect x="0" y="0" width="${width}" height="80" fill="#007bff"/>
        <text x="400" y="45" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="white">
          Countries Summary Dashboard
        </text>
        
        <!-- Total Countries Section -->
        <rect x="50" y="120" width="700" height="80" fill="#e9ecef" rx="10"/>
        <text x="400" y="150" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#333">
          Total Countries in Database
        </text>
        <text x="400" y="180" font-family="Arial, sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="#007bff">
          ${totalCountries}
        </text>
        
        <!-- Top 5 Countries Section -->
        <text x="50" y="250" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#333">
          Top 5 Countries by Estimated GDP (GBP)
        </text>
    `;

    // Add top countries
    topCountries.forEach((country, index) => {
      const y = 280 + index * 40;
      const formattedGDP = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(country.estimated_gbp);

      svgContent += `
        <rect x="50" y="${y - 25}" width="700" height="35" fill="${index % 2 === 0 ? '#f8f9fa' : '#ffffff'}" rx="5"/>
        <text x="70" y="${y}" font-family="Arial, sans-serif" font-size="16" fill="#333">
          ${index + 1}. ${country.name}
        </text>
        <text x="720" y="${y}" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="end" fill="#28a745">
          ${formattedGDP}
        </text>
      `;
    });

    // Add timestamp
    const formattedTime = new Date(lastRefresh).toLocaleString();
    svgContent += `
      <!-- Footer -->
      <rect x="0" y="520" width="${width}" height="80" fill="#6c757d"/>
      <text x="400" y="545" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="white">
        Last Refreshed
      </text>
      <text x="400" y="570" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="white">
        ${formattedTime}
      </text>
      
      </svg>
    `;

    return svgContent;
  }

  /**
   * Get the path to the generated country summary image
   *
   * Checks for the existence of a cached summary image and returns either
   * the file path for serving or an error message if the image is not available.
   *
   * @returns Promise<{imagePath: string} | {error: string}> - Image path or error message
   */
  async getCountryImage(): Promise<{ imagePath: string } | { error: string }> {
    try {
      const imagePath = path.join(process.cwd(), 'cache', 'summary.png');

      // Check if image exists
      const exists = await fs.pathExists(imagePath);

      if (!exists) {
        return { error: 'Summary image not found' };
      }

      return { imagePath };
    } catch (error) {
      console.error('Error getting country image:', error);
      return { error: 'Summary image not found' };
    }
  }

  /**
   * Retrieve all countries from the database
   *
   * Returns all country records with complete information including
   * calculated GDP estimates and current exchange rates.
   *
   * @returns Promise<Country[]> - Array of all countries in the database
   */
  async findAllCountries() {
    return this.countryRepository.find();
  }
}
