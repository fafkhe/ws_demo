import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class createRateDto {
  @IsNumber()
  from: number;

  @IsNumber()
  to: number;

  @IsNumber()
  amount: number;
}

export class singleRateByCurrDto {
  @IsNumber()
  from: number;

  @IsNumber()
  to: number;
}


export class editRateDto {
  @IsNumber()
  from: number;

  @IsNumber()
  to: number;

  @IsNumber()
  amount: number;
}


export class RateQueryDto {

  @IsOptional()
  limit: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  page: number;
}
