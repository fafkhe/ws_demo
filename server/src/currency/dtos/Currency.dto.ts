import { IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class createCurrencyDto {
  @IsString()
  title: string;
}

export class CurrencyQueryDto {
  @IsOptional()
  limit: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  page: number;
}
