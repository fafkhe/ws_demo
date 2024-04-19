import { IsNumber } from 'class-validator';

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
