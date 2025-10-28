import { registerAs } from '@nestjs/config';

export default registerAs('api', () => ({
  countries: {
    url:
      process.env.COUNTRIES_API_URL ||
      'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies',
  },
  exchangeRate: {
    url:
      process.env.EXCHANGE_RATE_API_URL ||
      'https://open.er-api.com/v6/latest/USD',
    baseCurrency: process.env.EXCHANGE_RATE_API_BASE_CURRENCY || 'USD',
  },
}));
