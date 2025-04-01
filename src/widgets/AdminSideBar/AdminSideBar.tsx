import React, { useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./AdminSideBar.module.scss";

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
  AiOutlineClose,
  AiOutlineLogout
} from "react-icons/ai";
import { useSidebar } from "@/features/SidebarContext/SidebarContext";

const AdminSidebar: React.FC = () => {
  const { isCollapsed, isMobile, isOpen, toggleSidebar, closeSidebar } =
    useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    // Remove tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Redirect to login page
    navigate('/admin/login');
  }, [navigate]);

  // Separate regular nav items from logout
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
    }
  ];

  const logoutItem = {
    path: "/admin/login",
    label: "Выйти",
    icon: <AiOutlineLogout size={20} />
  };

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
          {!isCollapsed && (
            <Link to="/" className={styles.logo}>
              <img src="/logo.svg" alt="Дружба Народов" />
            </Link>
          )}

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
          {/* Regular nav items */}
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${isActive(item.path) ? styles.active : ""}`}
              onClick={isMobile ? closeSidebar : undefined}
            >
              <span className={styles.icon}>{item.icon}</span>
              {(!isCollapsed || isMobile) && (
                <span className={styles.label}>{item.label}</span>
              )}
              {isActive(item.path) && (
                <div className={styles.activeIndicator} />
              )}
            </Link>
          ))}
          
          {/* Logout item - using button with navItem styling to trigger handleLogout */}
          <button
            className={`${styles.navItem} ${styles.logoutButton}`}
            onClick={() => {
              handleLogout();
              if (isMobile) closeSidebar();
            }}
          >
            <span className={styles.icon}>{logoutItem.icon}</span>
            {(!isCollapsed || isMobile) && (
              <span className={styles.label}>{logoutItem.label}</span>
            )}
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          {/* Toggle button for non-mobile */}
          {!isMobile && (
            <button
              className={styles.toggleButton}
              onClick={toggleSidebar}
              aria-label={
                isCollapsed ? "Развернуть сайдбар" : "Свернуть сайдбар"
              }
            >
              {isCollapsed ? (
                <AiOutlineMenuUnfold size={20} />
              ) : (
                <AiOutlineMenuFold size={20} />
              )}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;