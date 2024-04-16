import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class CurrencyService {
  constructor(private dataSource: DataSource) {
    console.log(this.dataSource, '[]]]]]]]]');
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
}
