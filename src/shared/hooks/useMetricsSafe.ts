import { useState, useEffect } from 'react';
import { metricsMock } from '@/utils/metricsMock';

/**
 * Безопасный хук для работы с метрикой. 
 * Использует реальную Яндекс.Метрику, если она доступна, иначе использует заглушку.
 * 
 * @returns {Object} Объект с функциями метрики
 */
export const useMetricsSafe = () => {
  // Начинаем с mock-метрики
  const [metrics, setMetrics] = useState(metricsMock);
  
  useEffect(() => {
    // Пытаемся загрузить реальную метрику только один раз при монтировании
    let mounted = true;
    
    const loadRealMetrics = async () => {
      try {
        // Динамический импорт модуля с метрикой (ES модули)
        const module = await import('@/features/YandexMetrika/YandexMetrikaProvider');
        
        if (mounted && typeof module.useMetrika === 'function') {
          try {
            const realMetrics = module.useMetrika();
            if (realMetrics) {
              setMetrics(realMetrics);
              console.log('Метрика успешно инициализирована');
            }
          } catch (hookError) {
            console.warn('Ошибка при вызове хука useMetrika:', hookError);
          }
        }
      } catch (importError) {
        console.warn('Не удалось загрузить модуль метрики:', importError);
      }
    };
    
    loadRealMetrics();
    
    // Очистка при размонтировании
    return () => {
      mounted = false;
    };
  }, []);
  
  return metrics;
};

export default useMetricsSafe;