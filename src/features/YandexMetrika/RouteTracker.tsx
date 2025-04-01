import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMetrika } from './YandexMetrikaProvider';

/**
 * Компонент для отслеживания изменения маршрутов в Яндекс.Метрике
 * Должен быть размещен внутри Router
 */
export const RouteTracker: React.FC = () => {
  const location = useLocation();
  const { sendEvent, counterId } = useMetrika();
  
  useEffect(() => {
    // Отправляем информацию о просмотре страницы
    if (window.ym) {
      const currentUrl = location.pathname + location.search;
      
      // Используем counterId из контекста
      window.ym(counterId, 'hit', currentUrl);
      
      // Дополнительно отправляем событие
      sendEvent('page_view', {
        path: location.pathname,
        search: location.search,
        hash: location.hash
      });
    }
  }, [location, sendEvent, counterId]);

  return null; // Компонент не рендерит никаких элементов
};

export default RouteTracker;