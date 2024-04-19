import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { createRateDto } from './dtos/rate.dto';

@Injectable()
export class RateService {
  constructor(private dataSource: DataSource) {
    this.createTable();
  }

  async createTable(): Promise<void> {
    const query = `
    CREATE TABLE IF NOT EXISTS Rate (
    id SERIAL PRIMARY KEY,
    origin INTEGER,
    destination INTEGER,
    amount DECIMAL

    );
    `;
    await this.dataSource.query(query);
  }

  async createRate(body: createRateDto) {
    const from = body.from;
    const to = body.to;
    const amount = body.amount;

    await this.dataSource.manager.query(
      `INSERT INTO Rate (origin,destination,amount)
      VALUES ($1,$2,$3)
      ;`,
      [from, to, amount],
    );
    return 'ok';
  }
}
