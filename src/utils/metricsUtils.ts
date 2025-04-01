/**
 * Простые утилиты для работы с Яндекс.Метрикой без зависимостей от React
 */

// Подключаем типы из общего файла определений
// Эти типы уже объявлены в yandex-metrika.d.ts

// Константы событий
export const METRIC_EVENTS = {
    FORM_OPEN: 'form_open',
    FORM_SUBMIT: 'form_submit',
    FORM_CLOSE: 'form_close',
    FORM_FIELD_FILLED: 'form_field_filled',
    BUTTON_CLICK: 'button_click',
    PAGE_VIEW: 'page_view',
    // ...другие события
  };
  
  // Константы целей
  export const METRIC_GOALS = {
    CAR_REQUEST_SUBMITTED: 'car_request_submitted',
    CALCULATOR_CALCULATION_COMPLETE: 'calculator_calculation_complete',
    // ...другие цели
  };
  
  /**
   * Отправляет событие в Яндекс.Метрику
   * Работает, даже если метрика не инициализирована
   */
  export function sendMetricEvent(name: string, params?: Record<string, any>): void {
    try {
      if (window.ym && typeof window.ym === 'function') {
        // Пытаемся найти ID счетчика
        let metrikaId: number | null = null;
        
        // Поиск по скрипту
        try {
          const metrikaScript = document.querySelector('script[src*="mc.yandex.ru/metrika"]');
          if (metrikaScript) {
            const idMatch = metrikaScript.getAttribute('src')?.match(/[?&]id=(\d+)/);
            if (idMatch && idMatch[1]) {
              metrikaId = parseInt(idMatch[1], 10);
            }
          }
        } catch (e) {
          // Игнорируем ошибки
        }
        
        // Поиск по noscript
        if (!metrikaId) {
          try {
            const noscriptImage = document.querySelector('noscript img[src*="mc.yandex.ru/watch/"]');
            if (noscriptImage) {
              const idMatch = noscriptImage.getAttribute('src')?.match(/\/watch\/(\d+)/);
              if (idMatch && idMatch[1]) {
                metrikaId = parseInt(idMatch[1], 10);
              }
            }
          } catch (e) {
            // Игнорируем ошибки
          }
        }
        
        // Если ID не найден, используем любой доступный счетчик
        if (!metrikaId && window.Ya && window.Ya._metrika && window.Ya._metrika.counters) {
          try {
            const counterIds = Object.keys(window.Ya._metrika.counters);
            if (counterIds.length > 0) {
              metrikaId = parseInt(counterIds[0], 10);
            }
          } catch (e) {
            // Игнорируем ошибки
          }
        }
        
        // Если ID найден, отправляем событие
        if (metrikaId) {
          window.ym(metrikaId, 'params', { [name]: params || true });
          console.log(`[Метрика] Событие отправлено: ${name}`, params);
          return;
        }
      }
      
      // Если не удалось отправить, логируем в консоль
      console.log(`[Метрика-заглушка] Событие: ${name}`, params);
    } catch (e) {
      // В случае любой ошибки, просто логируем и продолжаем
      console.warn('[Метрика] Ошибка при отправке события:', e);
    }
  }
  
  /**
   * Отправляет достижение цели в Яндекс.Метрику
   * Работает, даже если метрика не инициализирована
   */
  export function sendMetricGoal(name: string, params?: Record<string, any>): void {
    try {
      if (window.ym && typeof window.ym === 'function') {
        // Пытаемся найти ID счетчика (как и в sendMetricEvent)
        let metrikaId: number | null = null;
        
        // Поиск по скрипту
        try {
          const metrikaScript = document.querySelector('script[src*="mc.yandex.ru/metrika"]');
          if (metrikaScript) {
            const idMatch = metrikaScript.getAttribute('src')?.match(/[?&]id=(\d+)/);
            if (idMatch && idMatch[1]) {
              metrikaId = parseInt(idMatch[1], 10);
            }
          }
        } catch (e) {
          // Игнорируем ошибки
        }
        
        // Поиск по noscript
        if (!metrikaId) {
          try {
            const noscriptImage = document.querySelector('noscript img[src*="mc.yandex.ru/watch/"]');
            if (noscriptImage) {
              const idMatch = noscriptImage.getAttribute('src')?.match(/\/watch\/(\d+)/);
              if (idMatch && idMatch[1]) {
                metrikaId = parseInt(idMatch[1], 10);
              }
            }
          } catch (e) {
            // Игнорируем ошибки
          }
        }
        
        // Если ID не найден, используем любой доступный счетчик
        if (!metrikaId && window.Ya && window.Ya._metrika && window.Ya._metrika.counters) {
          try {
            const counterIds = Object.keys(window.Ya._metrika.counters);
            if (counterIds.length > 0) {
              metrikaId = parseInt(counterIds[0], 10);
            }
          } catch (e) {
            // Игнорируем ошибки
          }
        }
        
        // Если ID найден, отправляем событие
        if (metrikaId) {
          window.ym(metrikaId, 'reachGoal', name, params);
          console.log(`[Метрика] Цель достигнута: ${name}`, params);
          return;
        }
      }
      
      // Если не удалось отправить, логируем в консоль
      console.log(`[Метрика-заглушка] Цель: ${name}`, params);
    } catch (e) {
      // В случае любой ошибки, просто логируем и продолжаем
      console.warn('[Метрика] Ошибка при отправке цели:', e);
    }
  }
  
  export default {
    sendMetricEvent,
    sendMetricGoal,
    METRIC_EVENTS,
    METRIC_GOALS
  };