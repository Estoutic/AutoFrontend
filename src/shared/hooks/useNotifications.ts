import { useNotification } from '@/features/notifications/NotificationContext';
import { NotificationType } from '@/features/notifications/types';
import { useCallback } from 'react';

export const useNotifications = () => {
  const { addNotification } = useNotification();

  const showNotification = useCallback(
    (type: NotificationType, message: string, title?: string, duration: number = 10000) => {
      console.log(`Вызов showNotification: тип=${type}, сообщение=${message}, заголовок=${title}, длительность=${duration}`);
      
      const finalDuration = Math.max(duration, 3000);
      
      return addNotification({
        type,
        message,
        title,
        duration: finalDuration,
      });
    },
    [addNotification]
  );

  const showError = useCallback(
    (message: string, title: string = 'Ошибка', duration: number = 7000) => {
      console.log(`Вызов showError: сообщение=${message}`);
      return showNotification('error', message, title, duration);
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (message: string, title: string = 'Предупреждение', duration: number = 7000) => {
      console.log(`Вызов showWarning: сообщение=${message}`);
      return showNotification('warning', message, title, duration);
    },
    [showNotification]
  );

  const showSuccess = useCallback(
    (message: string, title: string = 'Успешно', duration: number = 7000) => {
      console.log(`Вызов showSuccess: сообщение=${message}`);
      return showNotification('success', message, title, duration);
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (message: string, title: string = 'Информация', duration: number = 7000) => {
      console.log(`Вызов showInfo: сообщение=${message}`);
      return showNotification('info', message, title, duration);
    },
    [showNotification]
  );

  return {
    showNotification,
    showError,
    showWarning,
    showSuccess,
    showInfo,
  };
};