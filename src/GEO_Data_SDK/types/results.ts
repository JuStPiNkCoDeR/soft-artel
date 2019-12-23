import { GeoData } from './index';

// Интерфейс результата
export interface Result {
  type: ResultTypes,
  data: GeoData | string
}

// Тип слушателя результатов
export type ResultsHandler = (result: Result) => void;

// Всевозможные результатирующие события
export enum ResultTypes {
  GEODataReceived = "GEO DATA HAS SUCCESSFULLY RECEIVED",
  IPPassedValidation = "IP IS CORRECT"
}

export default Result;
