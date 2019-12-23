import { GeoData } from './types';

const IP = require('ip');

export default {
  /**
   * Проверям правильность IP адреса
   *
   * @param ip
   */
  parseIP(ip: string): boolean {
    return IP.isV4Format(ip) || IP.isV6Format(ip);
  },
  /**
   * Проверяем правильность требуемых гео данных
   *
   * @param data
   */
  parseGeoData(data: GeoData): boolean {
    return ((!isNaN(data.lat) && isFinite(data.lat)) && (!isNaN(data.lng) && isFinite(data.lng)) && data.city.length > 0 && data.country.length > 0);
  }
}
