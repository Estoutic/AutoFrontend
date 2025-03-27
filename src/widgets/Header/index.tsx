import React from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.svg";
import { LanguageSwitcher } from "@/features/LanguageSwitcher/LanguageSwitcher";
import styles from "./Header.module.scss";
import { useTranslation } from "react-i18next";
import MobileSidebar from "../MobileSideBar/MobileSideBar";

export const Header = () => {
  const { t } = useTranslation();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link to="/" className={styles.logo}>
            <img src={logo} alt="Дружба Народов" />
          </Link>

          <nav className={styles.desktopNav}>
            <Link to="/">{t("header.aboutUs")}</Link>
            <Link to="/catalog">{t("header.catalog")}</Link>
            <Link to="/calculator">{t("header.calculator")}</Link>
            <Link to="/contacts">{t("header.contacts")}</Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>
      
      <MobileSidebar />
    </>
  );
};

export default Header;