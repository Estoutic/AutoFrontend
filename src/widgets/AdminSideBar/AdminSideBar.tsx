// AdminSidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./AdminSidBar.module.scss";

import {
  AiOutlineHome,
  AiOutlineFileText,
  AiOutlineBarChart,
  AiOutlineCar,
  AiOutlineAppstore,
  AiOutlineTeam,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
  AiOutlineMenu,
  AiOutlineClose
} from "react-icons/ai";
import { useSidebar } from "@/features/SidebarContext/SidebarContext";

const AdminSidebar: React.FC = () => {
  const { isCollapsed, isMobile, isOpen, toggleSidebar, closeSidebar } = useSidebar();
  const location = useLocation();

  const navItems = [
    { path: "/admin", label: "Главная", icon: <AiOutlineHome size={20} /> },
    {
      path: "/admin/applications",
      label: "Заявки",
      icon: <AiOutlineFileText size={20} />,
    },
    {
      path: "/admin/reports",
      label: "Отчёты",
      icon: <AiOutlineBarChart size={20} />,
    },
    {
      path: "/admin/cars",
      label: "Автомобили",
      icon: <AiOutlineCar size={20} />,
    },
    {
      path: "/admin/models",
      label: "Модели автомобилей",
      icon: <AiOutlineAppstore size={20} />,
    },
    {
      path: "/admin/users",
      label: "Сотрудники",
      icon: <AiOutlineTeam size={20} />,
    },
  ];

  const isActive = (path: string) => {
    return (
      location.pathname === path ||
      (path !== "/admin" && location.pathname.startsWith(path))
    );
  };

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <button 
          className={styles.mobileToggle} 
          onClick={toggleSidebar}
          aria-label="Открыть меню"
        >
          <AiOutlineMenu size={24} />
        </button>
      )}

      <aside
        className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""} ${isMobile ? styles.mobile : ""} ${isOpen ? styles.open : ""}`}
      >
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.logo}>
            <img src="/logo.svg" alt="Дружба Народов" />
          </Link>
          
          {/* Mobile close button (X) */}
          {isMobile && (
            <button 
              className={styles.closeButton} 
              onClick={closeSidebar}
              aria-label="Закрыть меню"
            >
              <AiOutlineClose size={20} />
            </button>
          )}
        </div>

        <nav className={styles.navContainer}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${isActive(item.path) ? styles.active : ""}`}
              onClick={isMobile ? closeSidebar : undefined}
            >
              <span className={styles.icon}>{item.icon}</span>
              {(!isCollapsed || isMobile) && <span className={styles.label}>{item.label}</span>}
              {isActive(item.path) && <div className={styles.activeIndicator} />}
            </Link>
          ))}
        </nav>

        {!isMobile && (
          <div className={styles.sidebarFooter}>
            <button
              className={styles.toggleButton}
              onClick={toggleSidebar}
              aria-label={isCollapsed ? "Развернуть сайдбар" : "Свернуть сайдбар"}
            >
              {isCollapsed ? (
                <AiOutlineMenuUnfold size={20} />
              ) : (
                <AiOutlineMenuFold size={20} />
              )}
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default AdminSidebar;