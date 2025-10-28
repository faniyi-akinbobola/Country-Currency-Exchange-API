import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

/**
 * Bootstrap the Country Currency Exchange API application
 *
 * This function:
 * 1. Creates the NestJS application instance
 * 2. Configures global validation pipes for request validation
 * 3. Sets up comprehensive Swagger API documentation
 * 4. Configures server options and starts the application
 *
 * Environment Configuration:
 * - PORT: Server port (default: 3000)
 * - Database connection settings
 * - External API URLs for country and exchange rate data
 *
 * @returns Promise<void> - Resolves when the application is successfully started
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3000);

  // Enable validation pipes globally
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger API Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Country Currency Exchange API')
    .setDescription(
      'A comprehensive REST API for managing country data with real-time exchange rates and GDP calculations.\n\n' +
        'Features:\n' +
        '• Fetch country data from RestCountries API\n' +
        '• Get real-time exchange rates from Open Exchange Rates API\n' +
        '• Calculate estimated GDP using: population × random(1000-2000) ÷ exchange_rate\n' +
        '• Generate visual summary images\n' +
        '• Search and delete countries by name\n' +
        '• Database status monitoring\n\n' +
        'All endpoints support comprehensive error handling with proper HTTP status codes (400, 404, 503).',
    )
    .setVersion('1.0.0')
    .addTag(
      'Countries',
      'All country-related operations including CRUD, search, and data refresh',
    )
    .setContact(
      'API Support',
      'https://github.com/your-username/country-currency-exchange',
      'support@example.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3003', 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'Country Currency Exchange API Docs',
  });

  console.log(`🚀 Application is starting on port ${port}`);
  await app.listen(port);
  console.log(`🎯 Application is running on: http://localhost:${port}`);
  console.log(
    `📚 API Documentation available at: http://localhost:${port}/api/docs`,
  );
}
bootstrap();
