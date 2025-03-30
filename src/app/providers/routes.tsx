import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/shared/layouts/Layout/Layout";
import { HomePage } from "@/pages/HomePage";
import React from "react";
import CarCatalogPage from "@/pages/CarCatalogPage/CarCatalogPage";
import { CalculatorPage } from "@/pages/CalculatorPage/CalculatorPage";
import { AdminLoginPage } from "@/pages/AdminLoginPage/AdminLoginPage";
import { AdminLayout } from "@/shared/layouts/AdminLayout/AdminLayout";
import { AdminCarModelsPage } from "@/pages/AdminCarModelsPage/AdminCarModelsPage";
import AdminUsersPage from "@/pages/AdminUsersPage/AdminUsersPage";
import AdminCarsPage from "@/pages/AdminCarPage/AdminCarPage";
import AdminCarTranslationsPage from "@/pages/AdminCarTranslationsPage/AdminCarTranslationsPage";
import AdminApplicationsPage from "@/pages/AdminApplicationsPage/AdminApplicationsPage";
import AdminReportsPage from "@/pages/AdminReportsPage/AdminReportsPage";
import { RootLayout } from "@/shared/layouts/RootLayout/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Layout />,
        errorElement: <h1>error</h1>,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/catalog", element: <CarCatalogPage /> },
          { path: "/calculator", element: <CalculatorPage /> },

          //   { path: "/car/:id", element: <CarDetailsPage /> },
          //   { path: "/login", element: <LoginPage /> },
          //   { path: "/admin", element: <AdminPage /> },
        ],
      },
      { path: "/admin/login", element: <AdminLoginPage /> },
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { path: "/admin", element: <AdminCarsPage /> },

          {
            path: "/admin/models",
            element: <AdminCarModelsPage />,
          },
          {
            path: "/admin/users",
            element: <AdminUsersPage />,
          },
          {
            path: "/admin/cars",
            element: <AdminCarsPage />,
          },
          {
            path: "/admin/applications",
            element: <AdminApplicationsPage />,
          },
          {
            path: "/admin/car/:carId/translations",
            element: <AdminCarTranslationsPage />,
          },
          {
            path: "/admin/reports",
            element: <AdminReportsPage />,
          },
        ],
      },
    ],
  },
]);
