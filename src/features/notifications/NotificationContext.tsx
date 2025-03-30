import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Notification, NotificationContextType, NotificationType } from './types';
import { v4 as uuidv4 } from 'uuid';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Отладочный вывод при изменении списка уведомлений
  useEffect(() => {
    console.log('Текущий список уведомлений:', notifications);
  }, [notifications]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    console.log('Добавление уведомления:', notification);
    
    const id = uuidv4();
    const newNotification: Notification = {
      id,
      duration: notification.duration || 7000,  
      ...notification,
    };

    setNotifications((prev) => [...prev, newNotification]);
    
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    console.log('Удаление уведомления с ID:', id);
    setNotifications((prev) => {
      const exists = prev.some(notification => notification.id === id);
      console.log(`Уведомление с ID ${id} ${exists ? 'найдено' : 'не найдено'} в списке`);
      
      return prev.filter((notification) => notification.id !== id);
    });
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};