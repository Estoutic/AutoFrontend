import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import YandexMetrika from './YandexMetrika';

// Создаем типизированный контекст
interface YandexMetrikaContextType {
  sendGoal: (goalName: string, params?: Record<string, any>) => void;
  sendEvent: (eventName: string, params?: Record<string, any>) => void;
  counterId: number;
}

const YandexMetrikaContext = createContext<YandexMetrikaContextType | undefined>(undefined);

// Хук для использования Яндекс.Метрики в компонентах
export const useMetrika = (): YandexMetrikaContextType => {
  const context = useContext(YandexMetrikaContext);
  if (context === undefined) {
    throw new Error('useMetrika must be used within a YandexMetrikaProvider');
  }
  return context;
};

interface YandexMetrikaProviderProps {
  children: ReactNode;
  counterId: string;
}

// Провайдер для Яндекс.Метрики
export const YandexMetrikaProvider: React.FC<YandexMetrikaProviderProps> = ({ 
  children, 
  counterId 
}) => {
  const counterIdNumber = Number(counterId);

  // Определяем базовые методы отслеживания
  const sendGoal = useCallback((goalName: string, params?: Record<string, any>) => {
    if (window.ym) {
      window.ym(counterIdNumber, 'reachGoal', goalName, params);
      console.log(`Метрика: отправлена цель ${goalName}`, params ?? '');
    } else {
      console.warn('Яндекс.Метрика не инициализирована');
    }
  }, [counterIdNumber]);

  const sendEvent = useCallback((eventName: string, params?: Record<string, any>) => {
    if (window.ym) {
      window.ym(counterIdNumber, 'params', { 
        [eventName]: params || true 
      });
      console.log(`Метрика: отправлено событие ${eventName}`, params ?? '');
    } else {
      console.warn('Яндекс.Метрика не инициализирована');
    }
  }, [counterIdNumber]);

  return (
    <YandexMetrikaContext.Provider value={{ sendGoal, sendEvent, counterId: counterIdNumber }}>
      <YandexMetrika counterId={counterId} />
      {children}
    </YandexMetrikaContext.Provider>
  );
};

export default YandexMetrikaProvider;