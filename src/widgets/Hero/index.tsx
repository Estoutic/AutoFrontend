import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Hero.module.scss";
import carImage from "@/assets/car.png";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export const Hero = () => {
  const { t } = useTranslation();
  
  const headerRef = useRef<HTMLHeadingElement>(null);
  const subHeaderRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const contactsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      if (headerRef.current) {
        headerRef.current.classList.add(styles.animate);
      }
    }, 100);

    const timer2 = setTimeout(() => {
      if (subHeaderRef.current) {
        subHeaderRef.current.classList.add(styles.animate);
      }
    }, 400);

    const timer3 = setTimeout(() => {
      if (descriptionRef.current) {
        descriptionRef.current.classList.add(styles.animate);
      }
    }, 700);

    const timer4 = setTimeout(() => {
      if (carRef.current) {
        carRef.current.classList.add(styles.animate);
      }
    }, 1000);

    const timer5 = setTimeout(() => {
      if (contactsRef.current) {
        contactsRef.current.classList.add(styles.animate);
      }
    }, 1300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.text}>
          <h1 ref={headerRef} className={styles.mainTitle}>
            {t("hero.mainTitle")}
          </h1>
          <div className={styles.secondLine} ref={subHeaderRef}>
            <h1>{t("hero.subTitle")}</h1>
            <span className={styles.label}>
              <i>{t("hero.label")}</i>
            </span>
          </div>
        </div>

        <div className={styles.body}>
          <div className={[styles.text, styles.secondText].join(" ")}>
            <p ref={descriptionRef}>{t("hero.description")}</p>
            <div className={styles.contacts} ref={contactsRef}>
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
            <div className={styles.imageWrapper} ref={carRef}>
              <img src={carImage} alt={t("hero.altImage")} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;