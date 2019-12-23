import { Error, ErrorHandler, ErrorTypes } from "./types/errors";
import { Result, ResultsHandler, ResultTypes } from './types/results';

/**
 * @author Los' Alexander
 * @class Handlers
 *
 * Класс-утилита для работы с обработчиками событий
 *
 * @param H -> тип данных слушателей
 * @param T -> вид слушателей(при каком событии вызывать)
 */
export class Handlers
  <
    H extends ErrorHandler | ResultsHandler,
    T extends ErrorTypes | ResultTypes
  >
{
  // Слушатели
  private _handlers: Map<T, Set<H>> = new Map<T, Set<H>>();

  /**
   * Добавляет слушателя на указанный тип события
   *
   * @param handler
   * @param type
   */
  public addListener(handler: H, type: T): void {
    if (this._handlers.get(type) === undefined) this._handlers.set(type, new Set<H>());

    this._handlers.get(type).add(handler);
  }

  /**
   * Убирает слушателя из указанного типа события или из всех событий
   *
   * @param deleteHandler
   * @param type
   */
  public removeListener(deleteHandler: H, type?: T | null): void {
    this._handlers.forEach((value, key) => {
      if (type && type !== key) return;

      let array = Array.from<H>(value.values());

      array.splice(array.findIndex(handler => handler.name === deleteHandler.name), 1);

      this._handlers.set(key, new Set(array));
    });
  }

  /**
   * Вызвает всех слушатели указанного типа события с передачей параметра
   *
   * @param type
   * @param param
   */
  public triggerListeners(type: T, param) {
    let handlers = this._handlers.get(type);

    if (handlers !== undefined) {
      handlers.forEach(handler => {
        handler(param);
      })
    }
  }

  // Объединяет всех слушателей в одномерный массив
  private getValuesAsSingleArray(): Array<H> {
    let allHandlers = [];

    for (let typedHandlers of this._handlers.values()) {
      allHandlers.push(Array.from<H>(typedHandlers.values()));
    }

    const flat = function flatten(arr) {
      return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
      }, []);
    };

    return flat(allHandlers);
  }

  // геттер для получения только слушателей
  get allHandlers(): Array<H> {
    return this.getValuesAsSingleArray();
  }

  // функция-геттер для получения слушателей определенного события
  public getHandlers(type: T): Set<H> {
    return this._handlers.get(type);
  }
}

export default Handlers;
