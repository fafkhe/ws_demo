import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyController } from './currency/currency.controller';
import { CurrencyService } from './currency/currency.service';
import { CurrencyModule } from './currency/currency.module';
import { RateController } from './rate/rate.controller';
import { RateService } from './rate/rate.service';
import { RateModule } from './rate/rate.module';
import { config } from 'dotenv';

config();

console.log('hii im in app.module');

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
    }),
    CurrencyModule,
    RateModule,
  ],
  controllers: [AppController, CurrencyController, RateController],
  providers: [AppService, CurrencyService, RateService],
})
export class AppModule {}
