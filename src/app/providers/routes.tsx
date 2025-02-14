import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/shared/ui/Layout";
import { HomePage } from "@/pages/HomePage";
import React from "react";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, 
    errorElement: <h1>error</h1> ,
    children: [
      { path: "/", element: <HomePage /> },
    //   { path: "/catalog", element: <CatalogPage /> },
    //   { path: "/car/:id", element: <CarDetailsPage /> },
    //   { path: "/login", element: <LoginPage /> },
    //   { path: "/admin", element: <AdminPage /> },
    ],
  },
]);