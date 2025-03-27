import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./MobileSidebar.module.scss";
import { useTranslation } from "react-i18next";
import {
  AiOutlineHome,
  AiOutlineCar,
  AiOutlineCalculator,
  AiOutlineContacts,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
  AiOutlineClose
} from "react-icons/ai";
import { LanguageSwitcher } from "@/features/LanguageSwitcher/LanguageSwitcher";
import { useMobileSidebar } from "@/features/MobileSidebarContext/MobileSidebarContext";

const MobileSidebar: React.FC = () => {
  const { isCollapsed, toggleCollapse, isOpen, setIsOpen } = useMobileSidebar();
  const location = useLocation();
  const { t } = useTranslation();
  console.log("MobileSidebar component rendering");

  const navItems = [
    { path: "/", label: t("header.aboutUs"), icon: <AiOutlineHome size={20} /> },
    {
      path: "/catalog",
      label: t("header.catalog"),
      icon: <AiOutlineCar size={20} />,
    },
    {
      path: "/calculator",
      label: t("header.calculator"),
      icon: <AiOutlineCalculator size={20} />,
    },
    {
      path: "/contacts",
      label: t("header.contacts"),
      icon: <AiOutlineContacts size={20} />,
    },
  ];

  const isActive = (path: string) => {
    return (
      location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(path))
    );
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Backdrop overlay when sidebar is open */}
      <div 
        className={`${styles.backdrop} ${isOpen ? styles.visible : ""}`} 
        onClick={closeSidebar}
      />

      <button
        className={styles.mobileToggle}
        onClick={() => setIsOpen(true)}
      >
        <AiOutlineMenuUnfold size={24} />
      </button>

      <aside
        className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""} ${isOpen ? styles.open : ""}`}
      >
        <div className={styles.sidebarHeader}>
          {!isCollapsed && (
            <Link to="/" className={styles.logo} onClick={closeSidebar}>
              <img src="/logo.svg" alt="Дружба Народов" />
            </Link>
          )}
          <button 
            className={styles.closeButton}
            onClick={closeSidebar}
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        <nav className={styles.navContainer}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${isActive(item.path) ? styles.active : ""}`}
              onClick={closeSidebar}
            >
              <span className={styles.icon}>{item.icon}</span>
              {!isCollapsed && <span className={styles.label}>{item.label}</span>}
              {isActive(item.path) && <div className={styles.activeIndicator} />}
            </Link>
          ))}
          
          {/* Language switcher */}
          
        </nav>

        <div className={styles.sidebarFooter}>
        <div className={styles.languageSwitcherContainer}>
            <LanguageSwitcher />
          </div>
          <button
            className={styles.toggleButton}
            onClick={toggleCollapse}
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
    </>
  );
};

export default MobileSidebar;