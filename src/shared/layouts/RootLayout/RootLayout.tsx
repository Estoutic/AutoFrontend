import React from 'react';
import { Outlet } from 'react-router-dom';
import { NotificationContainer } from '@/features/notifications/NotificationContainer';

export const RootLayout: React.FC = () => {
  return (
    <>
      <Outlet />
      
      <NotificationContainer />
    </>
  );
};