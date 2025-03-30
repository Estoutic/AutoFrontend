import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./providers/routes";
import "@/styles/index.scss";  
import { NotificationProvider } from "@/features/notifications/NotificationContext";
import { NotificationContainer } from "@/features/notifications/NotificationContainer";

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </QueryClientProvider>
  );
};

export default App;