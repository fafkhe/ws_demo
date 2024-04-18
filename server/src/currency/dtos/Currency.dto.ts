import { IsString, IsOptional, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class createCurrencyDto {
  @IsString()
  @MinLength(1)
  title: string;
}

export class CurrencyQueryDto {
  @IsOptional()
  limit: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  page: number;
}
