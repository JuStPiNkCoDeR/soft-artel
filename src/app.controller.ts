import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { GeoData } from './GEO_Data_SDK/types';
import { AppService } from './app.service';
import Error, { ErrorTypes } from './GEO_Data_SDK/types/errors';
import Result, { ResultTypes } from './GEO_Data_SDK/types/results';

/**
 * @author Los' Alexander
 * @class AppController
 *
 * Маршрутизатор приложения
 */
@Controller()
export class AppController {
  /* Именуем слушателей для возможности удалять их в будушем */
  // обработчик неверного IP адреса
  public wrongIPHandler = (error: Error) => {
    throw new HttpException(error.message, error.code);
  };
  // обработчик отсутствия гео данных по IP адресу
  public emptyGeoDataHandler = (error: Error) => {
    throw new HttpException(error.message, error.code);
  };
  // обработчик неожиданных гео данных
  public unexpectedGeoDataHandler = (error: Error) => {
    throw new HttpException(error.message, error.code);
  };
  // обработчик при неизвестных ошибках
  public unexpectedError = (error: Error) => {
    throw new HttpException(error.message, error.code);
  };
  // универсальный обработчик всех ошибок
  public universalError = (error: Error) => {
    throw new HttpException(error.message, error.code);
  };
  // обработчик успешной валидации IP адреса
  public IPAddressPassed = (result: Result) => {
    console.log(result);
  };

  constructor(private readonly appService: AppService) {
    // Можно добавлять слушателей отдельно для каждого события ошибки
    /*this.appService.geoAPI.addErrorListener(this.wrongIPHandler, ErrorTypes.BadIPAddress);
    this.appService.geoAPI.addErrorListener(this.emptyGeoDataHandler, ErrorTypes.GeoDataNotFound);
    this.appService.geoAPI.addErrorListener(this.unexpectedGeoDataHandler, ErrorTypes.UnexpectedGeoData);
    this.appService.geoAPI.addErrorListener(this.unexpectedError, ErrorTypes.AnyError);*/

    // Или один слушатель для всех событий ошибок
    this.appService.geoAPI.addErrorListener(this.universalError, ErrorTypes.AnyError);

    // Добавляем обработчик для успешной проверки IP адреса
    this.appService.geoAPI.addResultListener(this.IPAddressPassed, ResultTypes.IPPassedValidation);
  }

  @Get()
  async handleIP(@Query('ip') ip): Promise<GeoData> {
    return new Promise<GeoData>(((resolve, reject) => {
      try {
        // Обработчик успешно полученных гео данных
        const GeoDataFetched = (result: Result) => {
          resolve(result.data as GeoData);
        };

        this.appService.geoAPI.addResultListener(GeoDataFetched, ResultTypes.GEODataReceived);
        // Запускаем процесс получение гео данных
        this.appService.fetchGeoData(ip);
      } catch (e) {
        reject(e);
      }
    }));
  }

  /* Для запроса к SDK внутри сервера можно создать новый экземпляр класса GeoData
  * или
  * устанавливать спецефичных слушателей только в определенном маршруте и чистит их
  * тогда можно спокойно использовать только один класс GeoData */
}
