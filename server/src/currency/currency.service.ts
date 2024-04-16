import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CurrencyQueryDto } from './dtos/Currency.dto';

@Injectable()
export class CurrencyService {
  constructor(private dataSource: DataSource) {
    this.createTable();
  }

  async createTable(): Promise<void> {
    const query = `
    CREATE TABLE IF NOT EXISTS Currency (
    id SERIAL PRIMARY KEY,
    Title text
    );
    `;
    await this.dataSource.query(query);
  }

  async createCurrency(title: string) {
    const Title = title;

    await this.dataSource.manager.query(
      ` INSERT INTO Currency (Title)
      VALUES ($1)
      ;`,
      [Title],
    );
    return 'ok';
  }

  async editCurrency(title: string, id: number) {
    await this.dataSource.manager.query(
      `
      UPDATE Currency
      SET title = $2
      WHERE id = $1
      `,
      [id, title],
    );

    return 'ok';
  }

  async allCurrencies(data: CurrencyQueryDto) {
    const page = data.page || 0;
    const limit = data.limit || 10;

    const currencies = await this.dataSource.manager.query(
      `
      SELECT c.id as id, c.title as title
        FROM public.Currency c
        OFFSET $1 ROWS FETCH NEXT $2 ROWS ONLY
      `,
      [page * limit, limit],
    );

    return currencies;
  }
}
