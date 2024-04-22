import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  RateQueryDto,
  createRateDto,
  editRateDto,
  singleRateByCurrDto,
} from './dtos/rate.dto';

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
    amount DECIMAL,
    last_amount DECIMAL

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
      `INSERT INTO Rate (origin,destination,amount,last_amount)
      VALUES ($1,$2,$3,$4)
      ;`,
      [from, to, amount, amount],
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
      return {
        result: null,
      };

    const [rate] = rateArr.map(this.convertor);

    return {
      result: rate,
    };
  }

  async editRate(body: editRateDto, id: number) {
    const amount = body.amount;

    if (isNaN(id)) {
      throw new BadRequestException('Not a Number!');
    }

    const rateArr = await this.dataSource.query(
      `
      SELECT * FROM Rate
      WHERE id = $1
      `,
      [id],
    );

    if (!rateArr.length)
      throw new BadRequestException('there is no rate with this id');

    await this.dataSource.query(
      `
      UPDATE Rate
      SET amount = $2, last_amount=$3
      WHERE id = $1
      `,
      [id, amount, rateArr[0].amount],
    );

    return 'ok';
  }

  async allRates(data: RateQueryDto) {
    const page = data.page || 0;
    const limit = data.limit || 10;

    const [rates, countArr] = await Promise.all([
      this.dataSource.manager.query(
        `
        SELECT r.id as id, r.amount as amount, oc.id as originId, oc.title as originTitle, dc.id as destination_id, dc.title as destination_Title
        FROM public.Rate r
        JOIN public.Currency oc
        ON  r.origin = oc.id
        JOIN public.Currency dc
        ON r.destination = dc.id
        ORDER BY id OFFSET $1 ROWS FETCH NEXT $2 ROWS ONLY
        `,
        [page * limit, limit],
      ),
      this.dataSource.manager.query(
        `
          SELECT count(id)
          FROM public.Rate
        `,
      ),
    ]);

    const count = countArr[0]?.count || 0;

    const result = rates.map(this.convertor);

    return {
      result,
      count,
    };
  }

  async singleRateById(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException('Not a Number!');
    }
    const singleRate = await this.dataSource.query(
      `
      SELECT r.id as id, r.amount as amount, oc.id as originId, oc.title as originTitle, dc.id as destination_id, dc.title as destination_Title
      FROM public.Rate r
      JOIN public.Currency oc
      ON  r.origin = oc.id
      JOIN public.Currency dc
      ON r.destination = dc.id
      WHERE (r.id = $1)
      
      `,
      [id],
    );

    if (!singleRate.length)
      throw new BadRequestException('there is no rate with this id ');

    const result = singleRate.map(this.convertor);

    return result;
  }

  async delete(id: number) {
    const rateArr = await this.dataSource.query(
      `
     SELECT * FROM public.Rate
     WHERE id = $1
      `,
      [id],
    );

    if (!rateArr.length)
      throw new BadRequestException('there is no rate with this id');

    await this.dataSource.query(
      `
      DELETE FROM Rate WHERE (Rate.id = $1)
      `,
      [id],
    );

    return 'ok';
  }
}
