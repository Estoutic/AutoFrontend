import React from 'react';
import { useNotifications } from '@/shared/hooks/useNotifications';

export const TestNotificationComponent: React.FC = () => {
  const { showSuccess, showError, showInfo, showWarning } = useNotifications();

  const testAllNotifications = () => {
    // Выводим в консоль для дебага
    console.log('Attempting to show notifications');
    
    showSuccess('Это сообщение об успехе');
    
    // Используем setTimeout чтобы избежать перекрытия уведомлений
    setTimeout(() => {
      showError('Это сообщение об ошибке');
    }, 300);
    
    setTimeout(() => {
      showWarning('Это предупреждение');
    }, 600);
    
    setTimeout(() => {
      showInfo('Это информационное сообщение');
    }, 900);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Тестирование уведомлений</h2>
      <button 
        onClick={testAllNotifications}
        style={{
          padding: '10px 20px',
          background: '#1e3a8a',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Показать все уведомления
      </button>
    </div>
  );
};