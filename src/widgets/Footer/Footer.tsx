import React from "react";
import styles from "./Footer.module.scss";
import { Link } from "react-router";
import logo from "@/assets/logo.svg";
import instagram from "@/assets/contact/instagram.svg";
import whatsapp from "@/assets/contact/whatsapp.svg";
import telegram from "@/assets/contact/telegram.svg";
import vk from "@/assets/contact/vk.svg";
import mail from "@/assets/mail.svg";
import phone from "@/assets/phone.svg";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.info}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="Дружба Народов" />
        </Link>
        <div className={styles.socialList}>
          <div className={styles.socialIcon}>
            <img src={instagram} alt="Instagram" />
          </div>
          <div className={styles.socialIcon}>
            <img src={whatsapp} alt="Instagram" />
          </div>
          <div className={styles.socialIcon}>
            <img src={telegram} alt="Instagram" />
          </div>
          <div className={styles.socialIcon}>
            <img src={vk} alt="Instagram" />
          </div>
        </div>
      </div>
      <div className={styles.navigationList}>
        <nav className={styles.nav}>
          <Link to="/about">О нас</Link>
          <Link to="/catalog">Каталог</Link>
          <Link to="/calculator">Калькулятор</Link>
          <Link to="/contacts">Контакты</Link>
        </nav>
        <div className={styles.contactList}>
          <div className={styles.contactField}>
            <div className={styles.contactIcon}>
              <img src={phone} alt="Phone" />
            </div>
            <p>+7-(915)-018-28-37</p>
          </div>
          <div className={styles.contactField}>
            <div className={styles.contactIcon}>
              <img src={mail} alt="Email" />
            </div>
            <p>drujba_narodov1@mail.ru</p>
          </div>
          <div className={styles.contactField}>
            <p> г. Москва, ул. Складочная, д.1, стр. 13</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
