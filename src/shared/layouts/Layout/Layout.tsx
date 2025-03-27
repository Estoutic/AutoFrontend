import { Outlet } from "react-router-dom";
import { Header } from "@/widgets/Header";
import React from "react";
import Footer from "@/widgets/Footer/Footer";
import { MobileSidebarProvider } from "@/features/MobileSidebarContext/MobileSidebarContext";

export const Layout = () => {
  return (
     <MobileSidebarProvider>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer/>
      </MobileSidebarProvider>
    
  );
};