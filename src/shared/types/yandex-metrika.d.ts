/**
 * Типы для Яндекс.Метрики
 * Глобальное объявление типа, чтобы избежать дублирования
 */

declare global {
    interface Window {
      ym: {
        (counterId: number, eventType: 'init', params: Record<string, any>): void;
        (counterId: number, eventType: 'hit', url: string, params?: Record<string, any>): void;
        (counterId: number, eventType: 'reachGoal', target: string, params?: Record<string, any>): void;
        (counterId: number, eventType: 'params', params: Record<string, any>): void;
        (counterId: number, eventType: string, ...args: any[]): void;
      };
      
      Ya?: {
        _metrika?: {
          counters?: Record<string, any>;
        };
      };
    }
  }
  
  // Экспортируем пустой объект, чтобы TypeScript воспринимал файл как модуль
  export {};