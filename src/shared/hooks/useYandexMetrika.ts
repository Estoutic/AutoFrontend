import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Хук для работы с Яндекс.Метрикой
 * @param counterId ID счетчика Яндекс.Метрики
 */
export const useYandexMetrika = (counterId: string) => {
  const location = useLocation();
  const counterIdNumber = Number(counterId);

  // Отслеживание изменения страницы
  useEffect(() => {
    if (window.ym) {
      window.ym(counterIdNumber, 'hit', location.pathname + location.search);
    }
  }, [location, counterIdNumber]);

  // Функция для отправки цели
  const sendGoal = useCallback((goalName: string, params?: Record<string, any>) => {
    if (window.ym) {
      window.ym(counterIdNumber, 'reachGoal', goalName, params);
      console.log(`Метрика: отправлена цель ${goalName}`, params ?? '');
    } else {
      console.warn('Яндекс.Метрика не инициализирована');
    }
  }, [counterIdNumber]);

  // Функция для отправки произвольного события
  const sendEvent = useCallback((eventName: string, params?: Record<string, any>) => {
    if (window.ym) {
      // Создаем объект с правильной структурой для метода params
      window.ym(counterIdNumber, 'params', { 
        [eventName]: params || true 
      });
      console.log(`Метрика: отправлено событие ${eventName}`, params ?? '');
    } else {
      console.warn('Яндекс.Метрика не инициализирована');
    }
  }, [counterIdNumber]);

  return { sendGoal, sendEvent };
};

export default useYandexMetrika;