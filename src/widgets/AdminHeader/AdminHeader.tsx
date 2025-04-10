import React from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.svg";
import styles from "./AdminHeader.module.scss";

export const AdminHeader = () => {
  const closeMenu = () => {
    const checkbox = document.getElementById(
      "adminHamburgerCheckbox",
    ) as HTMLInputElement;
    if (checkbox) checkbox.checked = false;
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="Admin Panel" />
        </Link>

        <nav className={styles.desktopNav}>
          <Link to="/admin/applications">Заявки</Link>
          <Link to="/admin/reports">Отчёты</Link>
          <Link to="/admin/cars">Автомобили</Link>
          <Link to="/admin/models">Модели автомобилей</Link>
          <Link to="/admin/users">Сотрудники</Link>
        </nav>

        <div className={styles.hamburgerWrapper}>
          <input
            type="checkbox"
            id="adminHamburgerCheckbox"
            className={styles.checkbox}
          />
          <label htmlFor="adminHamburgerCheckbox" className={styles.toggle}>
            <div className={`${styles.bar} ${styles.barTop}`}></div>
            <div className={`${styles.bar} ${styles.barMiddle}`}></div>
            <div className={`${styles.bar} ${styles.barBottom}`}></div>
          </label>
          <nav className={styles.mobileNav}>
            <Link to="/admin/applications" onClick={closeMenu}>
              Заявки
            </Link>
            <Link to="/admin/reports" onClick={closeMenu}>
              Отчёты
            </Link>
            <Link to="/admin/cars" onClick={closeMenu}>
              Автомобили
            </Link>
            <Link to="/admin/models" onClick={closeMenu}>
              Модели автомобилей
            </Link>
            <Link to="/admin/users" onClick={closeMenu}>
              Сотрудники
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
