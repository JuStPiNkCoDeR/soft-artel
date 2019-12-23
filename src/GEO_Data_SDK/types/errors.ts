// Интерфейс ошибок
export interface Error {
  type: ErrorTypes
  message: string,
  code: number
}

// Всевозможные виды ошибок
export enum ErrorTypes {
  BadIPAddress = "WRONG IP ADDRESS",
  GeoDataNotFound = "GEO DATA NOT FOUND",
  UnexpectedGeoData = "GEO DATA DO NOT MATCH TO PREDICATES",
  UnexpectedError = "UNEXPECTED ERROR",
  AnyError = "ANY ERROR"
}

// Тип слушателей
export type ErrorHandler = (error: Error) => void;

export default Error;
