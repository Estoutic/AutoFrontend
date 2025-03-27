// Sidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./AdminSidebar.module.scss";

import {
  AiOutlineHome,
  AiOutlineFileText,
  AiOutlineBarChart,
  AiOutlineCar,
  AiOutlineAppstore,
  AiOutlineTeam,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
} from "react-icons/ai";
import { useSidebar } from "@/features/SidebarContext/SidebarContext";

const AdminSidebar: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
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
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}
    >
      <div className={styles.sidebarHeader}>
        {!isCollapsed && (
          <Link to="/" className={styles.logo}>
            <img src="/logo.svg" alt="Дружба Народов" />
          </Link>
        )}
      </div>

      <nav className={styles.navContainer}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`${styles.navItem} ${isActive(item.path) ? styles.active : ""}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            {!isCollapsed && <span className={styles.label}>{item.label}</span>}
            {isActive(item.path) && <div className={styles.activeIndicator} />}
          </Link>
        ))}
      </nav>

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
    </aside>
  );
};

export default AdminSidebar;
