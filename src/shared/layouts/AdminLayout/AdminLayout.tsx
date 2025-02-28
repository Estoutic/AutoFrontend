import React from "react";
import { Outlet } from "react-router-dom";
import { AdminHeader } from "@/widgets/AdminHeader/AdminHeader";

export const AdminLayout: React.FC = () => {
  return (
    <>
      <AdminHeader />
      <main>
        <Outlet />
      </main>
    </>
  );
};
