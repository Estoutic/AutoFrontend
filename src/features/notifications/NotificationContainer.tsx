import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNotification } from './NotificationContext';
import { NotificationItem } from './NotificationItem';
import './Notifications.scss';

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();
  const portalRef = useRef<HTMLDivElement | null>(null);

  // Создаем div для портала при монтировании
  useEffect(() => {
    // Создаем элемент только если он ещё не существует
    if (!document.getElementById('notification-portal')) {
      const portalElement = document.createElement('div');
      portalElement.id = 'notification-portal';
      document.body.appendChild(portalElement);
      portalRef.current = portalElement;
    } else {
      portalRef.current = document.getElementById('notification-portal') as HTMLDivElement;
    }

    // Очистка при размонтировании
    return () => {
      if (portalRef.current && portalRef.current.parentNode === document.body) {
        document.body.removeChild(portalRef.current);
      }
    };
  }, []);

  // Отладочный лог
  useEffect(() => {
    console.log('NotificationContainer render, notifications:', notifications);
  }, [notifications]);

  if (!portalRef.current) {
    return null;
  }

  // Используем портал для рендеринга уведомлений
  return createPortal(
    <div className="notification-container">
      {notifications.length > 0 && (
        <div style={{ 
          padding: '10px', 
          background: '#f0f0f0', 
          borderRadius: '4px', 
          marginBottom: '10px',
          pointerEvents: 'auto' // Make this header clickable
        }}>
          <strong>Активные уведомления: {notifications.length}</strong>
        </div>
      )}
      {notifications.map((notification) => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
          onRemove={removeNotification} 
        />
      ))}
    </div>,
    portalRef.current
  );
};