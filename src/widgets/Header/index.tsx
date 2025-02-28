import React from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.svg";
import { LanguageSwitcher } from "@/features/LanguageSwitcher/LanguageSwitcher";
import styles from "./Header.module.scss";
import { useTranslation } from "react-i18next";

export const Header = () => {

  const { t } = useTranslation();
  const closeMenu = () => {
    const checkbox = document.getElementById("hamburgerCheckbox") as HTMLInputElement;
    if (checkbox) checkbox.checked = false;
  };

  return (
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
          <Link to="/admin">Админ</Link>
          <LanguageSwitcher />
        </nav>

        <div className={styles.hamburgerWrapper}>
          <input
            type="checkbox"
            id="hamburgerCheckbox"
            className={styles.checkbox}
          />
          <label htmlFor="hamburgerCheckbox" className={styles.toggle}>
            <div className={`${styles.bar} ${styles.barTop}`}></div>
            <div className={`${styles.bar} ${styles.barMiddle}`}></div>
            <div className={`${styles.bar} ${styles.barBottom}`}></div>
          </label>
          <nav className={styles.mobileNav}>
            <Link to="/" onClick={closeMenu}>
              {t("header.aboutUs")}
            </Link>
            <Link to="/catalog" onClick={closeMenu}>
              {t("header.catalog")}
            </Link>
            <Link to="/calculator" onClick={closeMenu}>
              {t("header.calculator")}
            </Link>
            <Link to="/contacts" onClick={closeMenu}>
              {t("header.contacts")}
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </div>
    </header>
  );
};