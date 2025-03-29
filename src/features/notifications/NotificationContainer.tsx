import React from 'react';
import { useNotification } from './NotificationContext';
import { NotificationItem } from './NotificationItem';
import './Notifications.scss';

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
          onRemove={removeNotification} 
        />
      ))}
    </div>
  );
};
