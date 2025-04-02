import React, { useEffect } from 'react';

interface YandexMetrikaProps {
  counterId: string; // Ваш ID счетчика Яндекс.Метрики
}

// Обратите внимание: декларация типа ym перенесена в src/shared/types/yandex-metrika.d.ts

export const YandexMetrika: React.FC<YandexMetrikaProps> = ({ counterId }) => {
  useEffect(() => {
    // Добавляем скрипт Яндекс.Метрики с правильными типами
    (function(m, e, t, r, i, k, a) {
      m[i] = m[i] || function() {
        (m[i].a = m[i].a || []).push(arguments);
      };
      m[i].l = 1 * (new Date() as any).getTime();
      
      // Корректная типизация DOM-элементов
      const scriptElement = e.createElement(t) as HTMLScriptElement;
      const firstScript = e.getElementsByTagName(t)[0];
      
      scriptElement.async = true;
      scriptElement.src = r;
      
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(scriptElement, firstScript);
      } else {
        e.head.appendChild(scriptElement);
      }
    })(
      window,
      document,
      'script',
      'https://mc.yandex.ru/metrika/tag.js',
      'ym'
    );

    // Инициализируем счетчик с правильными типами параметров
    window.ym(Number(counterId), 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
      ecommerce: 'dataLayer'
    });
    
    // Для очистки при размонтировании
    return () => {
      const metrikaScript = document.querySelector('script[src="https://mc.yandex.ru/metrika/tag.js"]');
      if (metrikaScript && metrikaScript.parentNode) {
        metrikaScript.parentNode.removeChild(metrikaScript);
      }
    };
  }, [counterId]);

  return (
    <noscript>
      <div>
        <img src={`https://mc.yandex.ru/watch/${counterId}`} style={{ position: 'absolute', left: '-9999px' }} alt="" />
      </div>
    </noscript>
  );
};

export default YandexMetrika;