import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/shared/layouts/Layout/Layout";
import { HomePage } from "@/pages/HomePage";
import React from "react";
import CarCatalogPage from "@/pages/CarCatalogPage/CarCatalogPage";
import { CalculatorPage } from "@/pages/CalculatorPage/CalculatorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, 
    errorElement: <h1>error</h1> ,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/catalog", element: <CarCatalogPage /> },
      { path: "/calculator", element: <CalculatorPage /> },
      
    //   { path: "/car/:id", element: <CarDetailsPage /> },
    //   { path: "/login", element: <LoginPage /> },
    //   { path: "/admin", element: <AdminPage /> },
    ],
  },
]);