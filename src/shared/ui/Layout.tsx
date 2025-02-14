import { Outlet } from "react-router-dom";
import { Header } from "@/widgets/Header";
import React from "react";

export const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};