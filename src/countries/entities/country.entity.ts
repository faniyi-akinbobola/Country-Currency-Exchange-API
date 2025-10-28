import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Country entity representing a country record in the database
 *
 * This entity stores comprehensive country information including:
 * - Basic country data (name, capital, region, population)
 * - Economic data (currency, exchange rates, estimated GDP)
 * - Visual data (flag URL)
 * - Metadata (creation and update timestamps)
 *
 * The estimated_gbp field is calculated using the formula:
 * population * random(1000-2000) / exchange_rate
 */
@Entity('countries')
export class Country {
  /**
   * Unique identifier for the country record
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Official name of the country
   * Max length: 100 characters
   */
  @Column({ length: 100 })
  name: string;

  /**
   * Capital city of the country
   * Max length: 100 characters, nullable for countries without capitals
   */
  @Column({ length: 100, nullable: true })
  capital: string;

  /**
   * Geographic region where the country is located
   * Max length: 50 characters (e.g., "Europe", "Asia", "Africa")
   */
  @Column({ length: 50 })
  region: string;

  /**
   * Total population of the country
   * Stored as integer for exact population counts
   */
  @Column('int')
  population: number;

  /**
   * Primary currency code used in the country
   * Max length: 10 characters (e.g., "USD", "EUR", "GBP")
   * Nullable for countries with no defined currency
   */
  @Column({ type: 'varchar', length: 10, nullable: true })
  currency_code: string | null;

  /**
   * Current exchange rate to USD
   * Precision: 10 digits total, 4 decimal places
   * Nullable when exchange rate is unavailable
   */
  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  exchange_rate: number | null;

  /**
   * Estimated GDP in GBP calculated using population and exchange rate
   * Formula: population * random(1000-2000) / exchange_rate
   * Precision: 15 digits total, 2 decimal places
   * Default: 0 for new records
   */
  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  estimated_gbp: number;

  /**
   * URL to the country's flag image
   * Max length: 255 characters, nullable when flag is unavailable
   */
  @Column({ length: 255, nullable: true })
  flag_url: string;

  /**
   * Timestamp when the record was last updated
   * Automatically managed by TypeORM
   */
  @UpdateDateColumn()
  last_refreshed_at: Date;
}
