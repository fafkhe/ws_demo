import { CurrencyService } from './currency.service';
import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { createCurrencyDto } from './dtos/createCurrency.dto';

@Controller('currency')
export class CurrencyController {
  constructor(private currService: CurrencyService) {}

  @Post('create')
  createCurrency(@Body() body: createCurrencyDto) {
    return this.currService.createCurrency(body.title);
  }
}
