<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

# 🌍 Country Currency Exchange API

> A production-ready REST API built with NestJS and TypeScript that provides comprehensive country data management with real-time exchange rates, automated GDP calculations, and interactive Swagger documentation.

**Perfect for applications requiring geographical and economic data with reliable performance and scalability.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0+-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://www.mysql.com/)
[![Railway](https://img.shields.io/badge/Deployed%20on-Railway-brightgreen.svg)](http://country-currency-exchange-api-production-b15f.up.railway.app)
[![API Docs](https://img.shields.io/badge/API%20Docs-Swagger-brightgreen.svg)](http://country-currency-exchange-api-production-b15f.up.railway.app/api/docs)

## � Live Demo

**🚀 API is live at**: [http://country-currency-exchange-api-production-b15f.up.railway.app](http://country-currency-exchange-api-production-b15f.up.railway.app)

**📚 Interactive API Documentation**: [http://country-currency-exchange-api-production-b15f.up.railway.app/api/docs](http://country-currency-exchange-api-production-b15f.up.railway.app/api/docs)

## �🎯 What This API Does

This API serves as a comprehensive solution for managing country data and economic calculations. It fetches real-time country information, integrates with exchange rate APIs, calculates estimated GDP figures, and provides visual summaries - all through a clean, well-documented REST interface.

## Features

- 🌍 **Country Data Management**: Fetch and store comprehensive country information
- 💱 **Real-time Exchange Rates**: Integration with external exchange rate APIs
- 📊 **GDP Calculations**: Automated estimated GDP calculations using population and exchange rates
- 🖼️ **Summary Images**: Auto-generated visual summaries of country data
- 🔍 **Search & Filter**: Find countries by name with partial matching
- 📈 **Status Monitoring**: Track data freshness and system health
- 🛡️ **Error Handling**: Comprehensive error handling with proper HTTP status codes

## API Endpoints

**Base URL**: `http://country-currency-exchange-api-production-b15f.up.railway.app`

### Core Operations

- `POST /countries/refresh` - Refresh country data from external APIs
- `GET /countries` - Get all countries
- `GET /countries/status` - Get system status and data freshness

### Search & Management

- `GET /countries/search?name={query}` - Search countries by name
- `DELETE /countries/delete?name={query}` - Delete countries by name pattern

### Visualization

- `GET /countries/image` - Get generated summary image

**💡 Try it live**: Visit the [Swagger UI](http://country-currency-exchange-api-production-b15f.up.railway.app/api/docs) to test all endpoints interactively!

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MySQL Server** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/mysql/)
- **Git** - [Download here](https://git-scm.com/)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd country-currency-exchange
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file**

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=country_currency_db

   # Application Configuration
   NODE_ENV=development
   PORT=3003

   # External APIs (these are pre-configured and should work)
   COUNTRIES_API_URL=https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies
   EXCHANGE_RATE_API_URL=https://open.er-api.com/v6/latest/USD
   EXCHANGE_RATE_API_BASE_CURRENCY=USD
   ```

## Database Setup

### Prerequisites

- MySQL Server installed and running
- Node.js and npm installed

### Environment Configuration

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_NAME=country_currency_db
   ```

### Database Creation

1. **Connect to MySQL**

   ```bash
   mysql -u root -p
   ```

2. **Create the database**

   ```sql
   CREATE DATABASE country_currency_db;
   CREATE USER 'your_username'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON country_currency_db.* TO 'your_username'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

3. **Verify connection**
   The application will automatically create the tables when you start it (thanks to TypeORM synchronization in development mode).

## 🏃‍♂️ Running the Application

### Development Mode (Recommended)

```bash
# Start with hot reload
npm run start:dev
```

### Other Run Options

```bash
# Production build and run
npm run build
npm run start:prod

# Standard development start
npm run start

# Debug mode
npm run start:debug
```

### Verify Installation

Once the server starts, you should see:

```
🚀 Application is starting on port 3003
🎯 Application is running on: http://localhost:3003
```

Visit `http://localhost:3003` to confirm the server is running.

## 📦 Dependencies

### Production Dependencies

| Package                    | Version | Purpose                       |
| -------------------------- | ------- | ----------------------------- |
| `@nestjs/common`           | ^11.0.1 | Core NestJS framework         |
| `@nestjs/core`             | ^11.0.1 | NestJS core functionality     |
| `@nestjs/config`           | ^4.0.2  | Configuration management      |
| `@nestjs/typeorm`          | ^11.0.0 | TypeORM integration           |
| `@nestjs/platform-express` | ^11.0.1 | Express platform adapter      |
| `typeorm`                  | ^0.3.27 | ORM for database operations   |
| `mysql2`                   | ^3.15.3 | MySQL database driver         |
| `axios`                    | ^1.13.0 | HTTP client for external APIs |
| `sharp`                    | ^0.34.4 | Image processing library      |
| `reflect-metadata`         | ^0.2.2  | Metadata reflection API       |
| `rxjs`                     | ^7.8.1  | Reactive programming library  |

### Development Dependencies

| Package           | Purpose                       |
| ----------------- | ----------------------------- |
| `@nestjs/cli`     | NestJS command-line interface |
| `@nestjs/testing` | Testing utilities             |
| `typescript`      | TypeScript compiler           |
| `eslint`          | Code linting                  |
| `prettier`        | Code formatting               |
| `jest`            | Testing framework             |

### Installing Dependencies

```bash
# Install all dependencies
npm install

# Install only production dependencies
npm install --only=production

# Install specific package
npm install package-name

# Install development dependency
npm install --save-dev package-name
```

## 🧪 Testing

### API Testing

#### Live API Testing (Production)
Test the live API directly:

```bash
# Base URL for production
BASE_URL="http://country-currency-exchange-api-production-b15f.up.railway.app"

# Refresh country data
curl -X POST $BASE_URL/countries/refresh

# Get all countries
curl $BASE_URL/countries

# Search countries by name
curl "$BASE_URL/countries/search?name=united"

# Get system status
curl $BASE_URL/countries/status

# Get summary image
curl $BASE_URL/countries/image -o summary.png
```

#### Local Development Testing
Use the provided HTTP test file for local testing:

```bash
# Open api-test.http in VS Code with REST Client extension
# Or use curl/Postman with these endpoints:

# Refresh country data
curl -X POST http://localhost:3003/countries/refresh

# Get all countries
curl http://localhost:3003/countries

# Search countries by name
curl "http://localhost:3003/countries/search?name=united"

# Get system status
curl http://localhost:3003/countries/status

# Get summary image
curl http://localhost:3003/countries/image
```

**🌐 Interactive Testing**: Visit the [Swagger UI](http://country-currency-exchange-api-production-b15f.up.railway.app/api/docs) for a complete interactive API testing experience!

### Unit & Integration Tests

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

## 🛠️ Development Tools

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type checking
npx tsc --noEmit
```

### Build & Production

```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

## 📊 Usage Examples

### 1. Try the Live API

```bash
# Production API base URL
BASE_URL="http://country-currency-exchange-api-production-b15f.up.railway.app"

# Get all countries (already populated with data)
curl $BASE_URL/countries

# Check system status
curl $BASE_URL/countries/status
```

### 2. Search Operations

```bash
# Find countries with "united" in the name
curl "$BASE_URL/countries/search?name=united"

# Find countries by region
curl "$BASE_URL/countries/search?name=africa"
```

### 3. Data Management

```bash
# Refresh country data from external APIs
curl -X POST $BASE_URL/countries/refresh

# Get visual summary
curl $BASE_URL/countries/image -o summary.png
```

### 4. Local Development Setup

```bash
# After local installation, refresh data from external APIs
curl -X POST http://localhost:3003/countries/refresh

# Check if data was loaded successfully
curl http://localhost:3003/countries/status
```

## 🔧 Troubleshooting

### Common Issues

**Port Already in Use**

```bash
# Check what's using the port
netstat -ano | findstr :3003

# Kill the process (Windows)
taskkill /f /pid <PID>

# Or change port in .env file
PORT=3004
```

**Database Connection Issues**

```bash
# Verify MySQL is running
mysql -u your_username -p

# Check database exists
SHOW DATABASES;

# Verify user permissions
SHOW GRANTS FOR 'your_username'@'localhost';
```

**Missing Dependencies**

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Install sharp (if image generation fails)
npm install sharp
```

### Environment Variables

Ensure all required environment variables are set in your `.env` file:

- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`
- `PORT` (default: 3003)
- `COUNTRIES_API_URL` and `EXCHANGE_RATE_API_URL`

## 🚀 Deployment

### 🌐 Live Production Deployment

**The API is currently deployed and running on Railway:**

- **Production URL**: [http://country-currency-exchange-api-production-b15f.up.railway.app](http://country-currency-exchange-api-production-b15f.up.railway.app)
- **API Documentation**: [http://country-currency-exchange-api-production-b15f.up.railway.app/api/docs](http://country-currency-exchange-api-production-b15f.up.railway.app/api/docs)
- **Platform**: [Railway](https://railway.app/)
- **Database**: Railway MySQL
- **Status**: ✅ Active and fully functional

### Railway Deployment Features

- ✅ **Automatic deployments** from GitHub
- ✅ **Managed MySQL database**
- ✅ **HTTPS enabled**
- ✅ **Environment variables** securely managed
- ✅ **Zero-downtime deployments**
- ✅ **Built-in monitoring** and logs

### Production Considerations

1. **Environment Setup**

   ```bash
   # Set production environment
   NODE_ENV=production

   # Disable TypeORM synchronization
   # (handled automatically by NODE_ENV=production)
   ```

2. **Build & Start**

   ```bash
   npm run build
   npm run start:prod
   ```

3. **Database Migration**
   - In production, disable `synchronize: true` in TypeORM config
   - Use proper database migrations
   - Backup your database before deployments

### Alternative Cloud Deployment Options

- **Railway** ⭐ (Currently used) - Easy deployment with managed services
- **Heroku**: Easy deployment with automatic builds
- **AWS EC2/ECS**: Scalable container deployment
- **DigitalOcean**: Simple droplet deployment
- **Render**: Modern alternative to Heroku
- **Vercel**: Great for serverless deployments

### Docker Deployment (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

For detailed deployment guides, check the [NestJS deployment documentation](https://docs.nestjs.com/deployment).

## 🏗️ Project Structure

```
country-currency-exchange/
├── src/
│   ├── countries/          # Countries module
│   │   ├── entities/       # TypeORM entities
│   │   ├── countries.controller.ts
│   │   ├── countries.service.ts
│   │   └── countries.module.ts
│   ├── config/             # Configuration files
│   │   ├── database.config.ts
│   │   └── api.config.ts
│   ├── app.module.ts       # Main application module
│   └── main.ts             # Application entry point
├── cache/                  # Generated summary images
├── test/                   # Test files
├── api-test.http          # HTTP test requests
├── .env.example           # Environment template
└── README.md              # This file
```

## 📚 Additional Resources

### NestJS Resources

- [NestJS Documentation](https://docs.nestjs.com) - Official documentation
- [NestJS Discord](https://discord.gg/G7Qnnhy) - Community support
- [TypeORM Documentation](https://typeorm.io/) - Database ORM guide

### External APIs Used

- [REST Countries API](https://restcountries.com/) - Country information
- [Exchange Rates API](https://open.er-api.com/) - Currency exchange rates

### Development Tools

- [VS Code REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) - For testing API endpoints
- [MySQL Workbench](https://www.mysql.com/products/workbench/) - Database management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Issues & Support

If you encounter any issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub issues](../../issues)
3. Create a new issue with detailed information:
   - Node.js version
   - MySQL version
   - Operating system
   - Error messages and logs
   - Steps to reproduce

---

**Built with ❤️ using [NestJS](https://nestjs.com/)**
