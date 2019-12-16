import { Controller, Get, HttpCode, Query, Req } from '@nestjs/common';
import { GeoData } from '../types';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async handleIP(@Query('ip') ip): Promise<GeoData> {
    return new Promise<GeoData>(((resolve, reject) => {
      try {
        resolve(this.appService.getGeoData(ip));
      } catch (e) {
        reject(e);
      }
    }));
  }
}
