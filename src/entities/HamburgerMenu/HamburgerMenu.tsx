import React from "react";
import styles from "./HamburgerMenu.module.scss";

export const HamburgerMenu = () => {
  return (
    <div className={styles.menuToggle}>
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

      <nav className={styles.nav}>
        <a href="#">Пункт 1</a>
        <a href="#">Пункт 2</a>
        <a href="#">Пункт 3</a>
      </nav>
    </div>
  );
};