import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useYandexMetrika(counterId: number) {
  const location = useLocation();

  useEffect(() => {
    // Проверяем, что ym доступна в window
    if (typeof window !== 'undefined' && (window as any).ym) {
      (window as any).ym(counterId, 'hit', location.pathname);
    }
  }, [location, counterId]);
}
