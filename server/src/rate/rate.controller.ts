import { Controller, Post, Body, Get, Param, Query, Delete } from '@nestjs/common';
import { RateService } from './rate.service';
import {
  RateQueryDto,
  createRateDto,
  editRateDto,
  singleRateByCurrDto,
} from './dtos/rate.dto';

@Controller('rate')
export class RateController {
  constructor(private rateService: RateService) {}

  @Post('/:id')
  editRate(@Body() body: editRateDto, @Param('id') id: string) {
    return this.rateService.editRate(body, +id);
  }

  @Post('create')
  createRate(@Body() body: createRateDto) {
    return this.rateService.createRate(body);
  }

  @Get('singleRate')
  singleRateByCurr(@Body() body: singleRateByCurrDto) {
    return this.rateService.singleRateBycurrency(body);
  }

  @Get('all')
  all(@Query() query: RateQueryDto) {
    return this.rateService.allRates(query);
  }

  @Get('single/:id')
  singleRate(@Param('id') id: string) {
    return this.rateService.singleRateById(+id);
  }

  @Delete('/:id')
  deleteRate(@Param('id') id: string) {
    return this.rateService.delete(+id)
  }
}
