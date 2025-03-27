import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AdminHeader } from "@/widgets/AdminHeader/AdminHeader";
import AdminSidebar from "@/widgets/AdminSideBar/AdminSideBar";
import { SidebarProvider } from "@/features/SidebarContext/SidebarContext";

export const AdminLayout: React.FC = () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main>
        <Outlet />
      </main>
    </SidebarProvider>
  );
};
