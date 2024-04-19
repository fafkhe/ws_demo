import { CurrencyService } from './currency.service';
import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { CurrencyQueryDto, createCurrencyDto } from './dtos/Currency.dto';

@Controller('currency')
export class CurrencyController {
  constructor(private currService: CurrencyService) {}

  @Post('create')
  createCurrency(@Body() body: createCurrencyDto) {
    return this.currService.createCurrency(body.title);
  }

  @Post('/:id')
  editCurrency(@Body() body: createCurrencyDto, @Param('id') id: number) {
    return this.currService.editCurrency(body.title, id);
  }

  @Get('all')
  getAll(@Query() query: CurrencyQueryDto) {
    return this.currService.allCurrencies(query)
  }

  
}
