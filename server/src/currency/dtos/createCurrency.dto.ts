import { IsString } from 'class-validator';

export class createCurrencyDto {
  @IsString()
  title: string;
}
