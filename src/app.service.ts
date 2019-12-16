import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GeoData } from '../types';
import validator from './validation';
const geoip = require('geoip-lite');

@Injectable()
export class AppService {
  getGeoData(ip: string): GeoData {
    if (!validator.parseIP(ip)) throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error: 'IP is incorrect'
    }, 400);

    const data = geoip.lookup(ip);

    if (!data) throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: 'No data for the IP'
    }, 404);

    return {
      lat: data.ll[0],
      lng: data.ll[1],
      country: data.country,
      city: data.city
    }
  }
}
