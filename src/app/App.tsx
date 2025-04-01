import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./providers/routes";
import "@/styles/index.scss";  
import { NotificationProvider } from "@/features/notifications/NotificationContext";
import { YandexMetrikaProvider } from "@/features/YandexMetrika/YandexMetrikaProvider";

const queryClient = new QueryClient();

// ID вашего счетчика Яндекс.Метрики (лучше хранить в .env)
const YANDEX_METRIKA_ID = "100682914"; // Замените на реальный ID

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <YandexMetrikaProvider counterId={YANDEX_METRIKA_ID}>
          <RouterProvider router={router} />
        </YandexMetrikaProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
};

export default App;