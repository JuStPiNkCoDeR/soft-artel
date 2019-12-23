import GeoData from '../src/GEO_Data_SDK';
import Error, { ErrorTypes } from '../src/GEO_Data_SDK/types/errors';
import Result, { ResultTypes } from '../src/GEO_Data_SDK/types/results';

// Проверка работы SDK
describe('Geo Data SDK', () => {
  let GEOData: GeoData;
  /* Слушатели ошибок */
  const wrongIPHandler = (error: Error) => {
    console.log(error);
  };
  const emptyGeoDataHandler = (error: Error) => {
    console.log(error);
  };
  const unexpectedGeoDataHandler = (error: Error) => {
    console.log(error);
  };
  const unexpectedError = (error: Error) => {
    console.log(error);
  };
  const anyError = (error: Error) => {
    console.log(`From any Error: ${error.message}`);
  };
  /* Результативные слушатели */
  const IPAddressPassed = (result: Result) => {
    console.log(result);
  };
  const GeoDataFetched = (result: Result) => {
    console.log(result);
  };

  // Инициализация SDK
  beforeAll(() => {
    GEOData = new GeoData();

    GEOData.addErrorListener(anyError, ErrorTypes.AnyError);
    GEOData.addErrorListener(unexpectedError, ErrorTypes.UnexpectedError);
    // слушатели хранятся в множестве, поэтому добавится только один обработчик unexpectedError
    GEOData.addErrorListener(unexpectedError, ErrorTypes.UnexpectedError);
    GEOData.addErrorListener(unexpectedGeoDataHandler, ErrorTypes.UnexpectedGeoData);
    GEOData.addErrorListener(emptyGeoDataHandler, ErrorTypes.GeoDataNotFound);
    GEOData.addErrorListener(wrongIPHandler, ErrorTypes.BadIPAddress);

    GEOData.addResultListener(IPAddressPassed, ResultTypes.IPPassedValidation);
    GEOData.addResultListener(GeoDataFetched, ResultTypes.GEODataReceived);
  });

  // Тестим получение гео данных (данные будут в консоли)
  it('fetch geo data correctly', () => {
    GEOData.getGeoData('207.97.227.239');
  });

  // Тестим обработку ошибки IP адреса (данные будут в консоли)
  it('handle IP error', () => {
    GEOData.getGeoData('207.2');
  });

  // Тестим обработку ошибки пустых гео данных (данные будут в консоли)
  it('handle no geo data', () => {
    GEOData.getGeoData('');
  });
});
