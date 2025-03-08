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

export const router = createBrowserRouter([
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
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      // { path: "/admin", element: <AdminPage /> },
      { path: "/admin/login", element: <AdminLoginPage /> },
      {
        path: "/admin/models",
        element: <AdminCarModelsPage />,
      },
      {
        path: "/admin/users",
        element: <AdminUsersPage />,
      },
    ],
  },
]);
