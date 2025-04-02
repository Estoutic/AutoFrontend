import React from 'react';
import { Outlet } from 'react-router-dom';
import { NotificationContainer } from '@/features/notifications/NotificationContainer';
import RouteTracker from '@/features/YandexMetrika/RouteTracker';

export const RootLayout: React.FC = () => {
  return (
    <>
      <Outlet />
      <RouteTracker />
      <NotificationContainer />
    </>
  );
};