import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./Hero.module.scss";
import carImage from "@/assets/car.png";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.text}>
          <h1>
            {t("hero.mainTitle")} <br />
          </h1>
          <div className={styles.secondLine}>
            <h1>{t("hero.subTitle")}</h1>
            <span className={styles.label}>
              <i>{t("hero.label")}</i>
            </span>
          </div>
        </div>

        <div className={styles.body}>
          <div className={[styles.text, styles.secondText].join(" ")}>
            <p>{t("hero.description")}</p>
            <div className={styles.contacts}>
              <div>
                <FaPhoneAlt />
                <span>{t("hero.phone")}</span>
              </div>
              <div>
                <FaEnvelope />
                <span>{t("hero.email")}</span>
              </div>
            </div>
          </div>

          <div className={styles.image}>
            <img src={carImage} alt={t("hero.altImage")} />
          </div>
        </div>
      </div>
    </section>
  );
};