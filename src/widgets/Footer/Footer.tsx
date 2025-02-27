import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className={styles.info}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt={t("footer.logoAlt")} />
        </Link>
        <div className={styles.socialList}>
          <div className={styles.socialIcon}>
            <img src={instagram} alt={t("footer.social.instagram")} />
          </div>
          <div className={styles.socialIcon}>
            <img src={whatsapp} alt={t("footer.social.whatsapp")} />
          </div>
          <div className={styles.socialIcon}>
            <img src={telegram} alt={t("footer.social.telegram")} />
          </div>
          <div className={styles.socialIcon}>
            <img src={vk} alt={t("footer.social.vk")} />
          </div>
        </div>
      </div>
      <div className={styles.navigationList}>
        <nav className={styles.nav}>
          <Link to="/about">{t("footer.nav.about")}</Link>
          <Link to="/catalog">{t("footer.nav.catalog")}</Link>
          <Link to="/calculator">{t("footer.nav.calculator")}</Link>
          <Link to="/contacts">{t("footer.nav.contacts")}</Link>
        </nav>
        <div className={styles.contactList}>
          <div className={styles.contactField}>
            <div className={styles.contactIcon}>
              <img src={phone} alt={t("footer.contact.phoneAlt")} />
            </div>
            <p>+7-(915)-018-28-37</p>
          </div>
          <div className={styles.contactField}>
            <div className={styles.contactIcon}>
              <img src={mail} alt={t("footer.contact.emailAlt")} />
            </div>
            <p>drujba_narodov1@mail.ru</p>
          </div>
          <div className={styles.contactField}>
            <p>{t("footer.contact.address")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;