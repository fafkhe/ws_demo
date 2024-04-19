import { Controller, Post ,Body} from '@nestjs/common';
import { RateService } from './rate.service';
import { createRateDto } from './dtos/rate.dto';

@Controller('rate')
export class RateController {
  
  constructor(private rateService: RateService) { }
  

  @Post('create')
  createRate(@Body() body:createRateDto)  {
    return this.rateService.createRate(body)
  }




}
