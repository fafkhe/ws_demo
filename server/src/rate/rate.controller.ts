import { Controller, Post, Body, Get } from '@nestjs/common';
import { RateService } from './rate.service';
import { createRateDto, singleRateByCurrDto } from './dtos/rate.dto';

@Controller('rate')
export class RateController {
  constructor(private rateService: RateService) {}

  @Post('create')
  createRate(@Body() body: createRateDto) {
    return this.rateService.createRate(body);
  }

  @Get('singleRate')
  singleRateByCurr(@Body() body: singleRateByCurrDto) {
    return this.rateService.singleRateBycurrency(body);
  }
}
