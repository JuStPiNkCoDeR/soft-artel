import { Injectable } from '@nestjs/common';
import GeoData from './GEO_Data_SDK';

/**
 * @author Los' Alexander
 * @class AppService
 *
 * Класс нашего приложения
 */
@Injectable()
export class AppService {
  // GEO_Data_SDK
  private _geo: GeoData = new GeoData();

  /**
   * запускает процесс получения гео данных
   *
   * @param ip
   */
  public fetchGeoData(ip: string): void {
    this._geo.getGeoData(ip);
  }

  // геттер для нашего SDK
  get geoAPI(): GeoData {
    return this._geo;
  }
}
