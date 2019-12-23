import Handlers from '../src/GEO_Data_SDK/handlers';
import { Error, ErrorHandler, ErrorTypes } from '../src/GEO_Data_SDK/types/errors';

// Проверка работы утилиты Handlers
describe('Handlers', () => {
  let handlers: Handlers<ErrorHandler, ErrorTypes>;
  /* Обработчики событий */
  const func1 = (error: Error) => console.log(error);
  const func2 = (error: Error) => console.log(error);

  // Инициализация
  beforeAll(() => {
    handlers = new Handlers<ErrorHandler, ErrorTypes>();
  });

  // Тестим добавление слушателей в множество
  it('Add listeners correctly', () => {
    handlers.addListener(func1, ErrorTypes.AnyError);
    handlers.addListener(func1, ErrorTypes.BadIPAddress);
    handlers.addListener(func1, ErrorTypes.AnyError);
    handlers.addListener(func2, ErrorTypes.AnyError);

    let allListeners = handlers.allHandlers;

    expect(allListeners.length).toBe(3);
    console.log(`The whole handlers count: ${allListeners.length}`);
  });

  // Тестим удаление слушателей из множества
  it('Remove listeners correctly', () => {
    handlers.removeListener(func1);

    let allListeners = handlers.allHandlers;

    expect(allListeners.length).toBe(1);
    console.log(`The whole handlers count: ${allListeners.length}`);

    handlers.removeListener(func2, ErrorTypes.AnyError);

    allListeners = handlers.allHandlers;

    expect(allListeners.length).toBe(0);
    console.log(`The whole handlers count: ${allListeners.length}`);
  });

  // Тестим вызов слушателей
  it('Trigger listeners correctly', () => {
    handlers.addListener(func1, ErrorTypes.AnyError);
    handlers.addListener(func1, ErrorTypes.BadIPAddress);
    handlers.addListener(func1, ErrorTypes.AnyError);

    handlers.triggerListeners(ErrorTypes.AnyError, {
      type: ErrorTypes.AnyError,
      message: "My error",
      code: -1
    } as Error);
  })
});
