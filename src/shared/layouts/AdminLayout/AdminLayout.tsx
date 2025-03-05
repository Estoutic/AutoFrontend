import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AdminHeader } from "@/widgets/AdminHeader/AdminHeader";

export const AdminLayout: React.FC = () => {

  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return (
    <>
      <AdminHeader />
      <main>
        <Outlet />
      </main>
    </>
  );
};
