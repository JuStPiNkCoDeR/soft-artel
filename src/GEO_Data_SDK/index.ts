import { Error, ErrorHandler, ErrorTypes } from './types/errors';
import { Result, ResultsHandler, ResultTypes } from './types/results';
import Handlers from './handlers';
import validator from './validation';
import { GeoData } from './types';

const geoIp = require('geoip-lite');

/**
 * @author Los' Alexander
 * @class GEOData
 *
 * Класс SDK для обработки запроса на получение гео данных по IP
 *
 * Прицип/парадигма: Собитийно-ориентированный (СОП)
 *
 * Лучше избегать анонимных слушателей, так как в дальнейшем не получится удалить их(по крайней мере нужные обработчики)
 */
export class GEOData {
  // слушатели ошибок
  private _errorHandlers: Handlers<ErrorHandler, ErrorTypes> = new Handlers<ErrorHandler, ErrorTypes>();
  // слушатели результативных событий
  private _successHandlers: Handlers<ResultsHandler, ResultTypes> = new Handlers<ResultsHandler, ResultTypes>();

  /**
   * Добавляет слушателя ошибок с указанным типом ошибки
   *
   * @param handler
   * @param type
   */
  public addErrorListener(handler: ErrorHandler, type: ErrorTypes = ErrorTypes.AnyError) {
    try {
      this._errorHandlers.addListener(handler, type);
    } catch (error) {
      this.throwError(error.toString(), 500, ErrorTypes.UnexpectedError);
    }
  }

  /**
   * Добавляет слушателя результативных событий с указанным типом результата
   *
   * @param handler
   * @param type
   */
  public addResultListener(handler: ResultsHandler, type: ResultTypes) {
    try {
      this._successHandlers.addListener(handler, type);
    } catch (error) {
      this.throwError(error.toString(), 500, ErrorTypes.UnexpectedError);
    }
  }

  /**
   * Удаляем указанный слушателя результативных событий
   * Можно указать отдельный тип, либо всех типов
   *
   * @param handler
   * @param type
   */
  public removeResultListener(handler: ResultsHandler, type?: ResultTypes | null) {
    try {
      this._successHandlers.removeListener(handler, type);
    } catch (error) {
      this.throwError(error.toString(), 500, ErrorTypes.UnexpectedError);
    }
  }

  /**
   * Удаляем указанный обработчик ошибки
   * Можно указать отдельный тип, либо всех типов
   *
   * @param handler
   * @param type
   */
  public removeErrorListener(handler: ErrorHandler, type?: ErrorTypes | null) {
    try {
      this._errorHandlers.removeListener(handler, type);
    } catch (error) {
      this.throwError(error.toString(), 500, ErrorTypes.UnexpectedError);
    }
  }

  /**
   * Запускает процесс получения гео данных
   *
   * Является отправной точкой для событий
   *
   * @param ip
   */
  public getGeoData(ip: string) {
    try {
      // Проверяем IP адрес
      if (!this.checkIP(ip)) return;
      // Получаем сырые гео данные
      const data = geoIp.lookup(ip);
      // Проверяем на наличие сырых гео данных
      if (!this.checkData(data)) return;
      // Переносим сырые гео данные в требуемый вид
      let geoData: GeoData = {
        lat: data.ll[0],
        lng: data.ll[1],
        country: data.country,
        city: data.city
      };
      // Проверяем корректность требуемых гео данных
      if (!this.checkGeoData(geoData)) return;
      // Запускаем обработчик с результатом гео данных
      this._successHandlers.triggerListeners(ResultTypes.GEODataReceived, {
        type: ResultTypes.GEODataReceived,
        data: geoData
      } as Result)
    } catch (error) {
      this.throwError(error.toString(), 500, ErrorTypes.UnexpectedError);
    }
  }

  /**
   * Проверяет наличие гео данных
   *
   * @param data
   * @return boolean
   */
  private checkData(data): boolean {
    if (!data) this.throwError("No data for the given IP", 404, ErrorTypes.GeoDataNotFound);

    return Boolean(data);
  }

  /**
   * Проверяет корректность гео данных
   *
   * @param data
   * @return boolean
   */
  private checkGeoData(data: GeoData): boolean {
    if (!validator.parseGeoData(data)) {
      this.throwError("Geo data looks unexpectedly", 404, ErrorTypes.UnexpectedGeoData);

      return false;
    } else return true;
  }

  /**
   * Проверяет IP адрес
   *
   * @param ip
   * @return boolean
   */
  private checkIP(ip: string): boolean {
    if (!validator.parseIP(ip)) {
      this.throwError( "IP address is incorrect", 400, ErrorTypes.BadIPAddress);

      return false;
    } else {
      this._successHandlers.triggerListeners(ResultTypes.IPPassedValidation, {
        type: ResultTypes.IPPassedValidation,
        data: ip
      } as Result);

      return true;
    }
  }

  /**
   * Вызывает слушателей ошибок, указанных типов или только для любых ошибок
   *
   * @param message
   * @param code
   * @param type
   */
  private throwError(message: string, code: number, type?: ErrorTypes | null) {
    this._errorHandlers.triggerListeners(type, {
      type,
      message,
      code,
    } as Error);

    this._errorHandlers.triggerListeners(ErrorTypes.AnyError, {
      type,
      message,
      code,
    } as Error)
  }
}

export default GEOData;
