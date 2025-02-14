import React from "react";
import logo from "@/assets/logo.svg";
import styles from "./Header.module.scss";
import { Link } from "react-router-dom";

export const Header = () => {
    return (
      <header className={styles.header}>
        <div className={styles.container}>
          <Link to="/" className={styles.logo}>
            <img src={logo} alt="Дружба Народов" />
          </Link>
          <nav className={styles.nav}>
            <Link to="/about">О нас</Link>
            <Link to="/catalog">Каталог</Link>
            <Link to="/calculator">Калькулятор</Link>
            <Link to="/contacts">Контакты</Link>
          </nav>
        </div>
      </header>
    );
  };