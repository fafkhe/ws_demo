import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { createRateDto, singleRateByCurrDto } from './dtos/rate.dto';

@Injectable()
export class RateService {
  constructor(private dataSource: DataSource) {
    this.createTable();
  }

  convertor(data) {
    return {
      id: data.id,
      amount: data.amount,
      origin: {
        id: data.originid,
        title: data.origintitle,
      },
      dest: {
        id: data.destination_id,
        title: data.destination_title,
      },
    };
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

    if (from == to) throw new BadRequestException('something went wrong');

    await this.dataSource.manager.query(
      `INSERT INTO Rate (origin,destination,amount)
      VALUES ($1,$2,$3)
      ;`,
      [from, to, amount],
    );
    return 'ok';
  }

  async singleRateBycurrency(body: singleRateByCurrDto) {
    const from = body.from;
    const to = body.to;

    const rateArr = await this.dataSource.manager.query(
      `
      SELECT r.id as id, r.amount as amount, oc.id as originId, oc.title as originTitle, dc.id as destination_id, dc.title as destination_Title
      FROM public.Rate r
      JOIN public.Currency oc
      ON  r.origin = oc.id
      JOIN public.Currency dc
      ON r.destination = dc.id
      WHERE (r.origin = $1)
      AND   (r.destination = $2)
     
      `,
      [from, to],
    );

    if (rateArr.length == 0)
      throw new BadRequestException('there is no rate with this id ');

    console.log(rateArr, 'ppp');

    const x = await rateArr.map(this.convertor);

    return x;
  }
}
