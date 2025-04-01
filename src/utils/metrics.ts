/**
 * Утилиты для работы с аналитикой, которые можно использовать
 * даже если контекст Яндекс.Метрики недоступен
 */

// Тип для функций отправки событий метрики
type MetricFunction = (name: string, params?: Record<string, any>) => void;

// Объект с пустыми реализациями (заглушками)
const fallbackMetrics = {
  // Для отправки целей
  sendGoal: (name: string, params?: Record<string, any>) => {
    console.log('[Метрика заглушка] Цель:', name, params);
  },
  
  // Для отправки событий 
  sendEvent: (name: string, params?: Record<string, any>) => {
    console.log('[Метрика заглушка] Событие:', name, params);
  }
};

/**
 * Безопасно получает функции метрики, используя fallback если контекст недоступен
 */
export const safeMetrics = () => {
  try {
    // Динамический импорт для избежания циклических зависимостей
    const { useMetrika } = require("@/features/YandexMetrika/YandexMetrikaProvider");
    
    try {
      // Пытаемся получить реальные функции из контекста
      return useMetrika();
    } catch (e) {
      console.warn('Метрика недоступна:', e);
      return fallbackMetrics;
    }
  } catch (e) {
    console.warn('Модуль метрики не найден:', e);
    return fallbackMetrics;
  }
};

/**
 * Константы с именами событий для единообразия использования
 */
export const METRIC_EVENTS = {
  // Формы
  FORM_OPEN: 'form_open',
  FORM_SUBMIT: 'form_submit',
  FORM_CLOSE: 'form_close',
  FORM_FIELD_FILLED: 'form_field_filled',
  
  // Каталог
  CATALOG_FILTER: 'catalog_filter',
  CATALOG_SORT: 'catalog_sort',
  CATALOG_PAGINATION: 'catalog_pagination',
  
  // Автомобили
  CAR_VIEW: 'car_view',
  CAR_REQUEST: 'car_request',
  
  // Расчеты
  CALCULATOR_USE: 'calculator_use',
  CALCULATOR_RESULT: 'calculator_result',
  
  // Общие
  PAGE_VIEW: 'page_view',
  BUTTON_CLICK: 'button_click',
  LANGUAGE_CHANGE: 'language_change'
};

/**
 * Константы с именами целей для единообразия использования
 */
export const METRIC_GOALS = {
  // Главные цели
  CAR_REQUEST_SUBMITTED: 'car_request_submitted',
  CALCULATOR_CALCULATION_COMPLETE: 'calculator_calculation_complete',
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',
  
  // Промежуточные цели
  EMAIL_CLICK: 'email_click',
  PHONE_CLICK: 'phone_click',
  SOCIAL_CLICK: 'social_click'
};

export default { safeMetrics, METRIC_EVENTS, METRIC_GOALS };