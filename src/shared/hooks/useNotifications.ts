import { useNotification } from '@/features/notifications/NotificationContext';
import { NotificationType } from '@/features/notifications/types';
import { useCallback } from 'react';

export const useNotifications = () => {
  const { addNotification } = useNotification();

  const showNotification = useCallback(
    (type: NotificationType, message: string, title?: string, duration?: number) => {
      addNotification({
        type,
        message,
        title,
        duration,
      });
    },
    [addNotification]
  );

  const showError = useCallback(
    (message: string, title?: string, duration?: number) => {
      showNotification('error', message, title || 'Ошибка', duration);
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (message: string, title?: string, duration?: number) => {
      showNotification('warning', message, title || 'Предупреждение', duration);
    },
    [showNotification]
  );

  const showSuccess = useCallback(
    (message: string, title?: string, duration?: number) => {
      showNotification('success', message, title || 'Успешно', duration);
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (message: string, title?: string, duration?: number) => {
      showNotification('info', message, title || 'Информация', duration);
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