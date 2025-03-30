import React, { useEffect, useState, useRef } from 'react';
import { Notification } from './types';

interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);
  // Используем ref для отслеживания, запущено ли удаление
  const isRemovingRef = useRef(false);
  
  // Отладочный лог при монтировании
  useEffect(() => {
    console.log('NotificationItem mounted:', notification.id, notification.message);
    
    // Auto-remove если указана продолжительность
    if (notification.duration && notification.duration !== Infinity) {
      const timer = setTimeout(() => {
        console.log('Таймер вышел, начинаем анимацию выхода:', notification.id);
        handleClose();
      }, notification.duration);
      
      return () => {
        console.log('Очистка таймера для:', notification.id);
        clearTimeout(timer);
      };
    }
  }, [notification.id, notification.duration, notification.message]);

  // Обработка нажатия на кнопку закрытия
  const handleClose = () => {
    // Предотвращаем повторное закрытие
    if (isRemovingRef.current) {
      console.log('Уведомление уже в процессе удаления:', notification.id);
      return;
    }
    
    isRemovingRef.current = true;
    console.log('Запускаем анимацию выхода для:', notification.id);
    
    setIsExiting(true);
    
    // Подождем пока анимация завершится, потом удалим
    setTimeout(() => {
      console.log('Удаляем уведомление после анимации:', notification.id);
      onRemove(notification.id);
    }, 500);
  };

  // Handle notification icon based on type
  const getIcon = () => {
    switch (notification.type) {
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        );
    }
  };

  // Встроенные стили для избежания проблем с CSS
  const notificationStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    backgroundColor: notification.type === 'error' ? '#fee2e2' : 
                    notification.type === 'warning' ? '#fef3c7' : 
                    notification.type === 'success' ? '#dcfce7' : 
                    '#eff6ff',
    border: `1px solid ${notification.type === 'error' ? '#fecaca' : 
                         notification.type === 'warning' ? '#fde68a' : 
                         notification.type === 'success' ? '#bbf7d0' : 
                         '#bfdbfe'}`,
    position: 'relative',
    marginBottom: '10px',
    opacity: isExiting ? '0' : '1',
    transform: isExiting ? 'translateX(100%)' : 'translateX(0)',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
    overflow: 'hidden',
    maxWidth: '100%'
  };

  // Функция для отладки закрытия уведомления при клике
  const debugClick = (e: React.MouseEvent) => {
    console.log('Клик на кнопке закрытия');
    e.preventDefault();
    e.stopPropagation(); // Предотвращаем всплытие события
    handleClose();
  };

  return (
    <div 
      style={notificationStyles}
      role="alert"
    >
      <div style={{ marginRight: '12px', color: 
                 notification.type === 'error' ? '#dc2626' : 
                 notification.type === 'warning' ? '#f59e0b' : 
                 notification.type === 'success' ? '#22c55e' : 
                 '#3b82f6' }}>
        {getIcon()}
      </div>
      <div style={{ flex: 1 }}>
        {notification.title && (
          <h3 style={{ 
            margin: '0 0 4px 0', 
            fontSize: '16px', 
            fontWeight: 600,
            color: notification.type === 'error' ? '#b91c1c' : 
                  notification.type === 'warning' ? '#d97706' : 
                  notification.type === 'success' ? '#15803d' : 
                  '#1d4ed8'
          }}>
            {notification.title}
          </h3>
        )}
        <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5, color: '#374151' }}>
          {notification.message}
        </p>
      </div>
      {/* Обновленная кнопка закрытия с улучшенной доступностью и взаимодействием */}
      <button 
        onClick={debugClick}
        style={{ 
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#9ca3af',
          marginLeft: '12px',
          padding: '5px', // Увеличиваем область нажатия
          width: '30px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100, // Увеличиваем z-index для предотвращения перекрытия
          position: 'relative', // Делаем относительное позиционирование
          borderRadius: '50%', // Делаем круглую кнопку
          transition: 'background-color 0.2s, color 0.2s'
        }}
        onMouseOver={(e) => {
          // Меняем стили при наведении для лучшей видимости
          e.currentTarget.style.backgroundColor = '#f3f4f6';
          e.currentTarget.style.color = '#4b5563';
        }}
        onMouseOut={(e) => {
          // Возвращаем исходные стили
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#9ca3af';
        }}
        aria-label="Закрыть уведомление"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};