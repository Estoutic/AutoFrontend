import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./providers/routes";
import "@/styles/index.scss";  
import { NotificationProvider } from "@/features/notifications/NotificationContext";
import { useYandexMetrika } from "@/shared/hooks/useYandexMetrika";

const queryClient = new QueryClient();

const YANDEX_METRIKA_ID = 100682914;

// useYandexMetrika(YANDEX_METRIKA_ID);

export const App = () => {
  // useYandexMetrika(YANDEX_METRIKA_ID);

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
          <RouterProvider router={router} />
      </NotificationProvider>
    </QueryClientProvider>
  );
};

export default App;