import styles from "./Hero.module.scss";
import carImage from "@/assets/car.png";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import React from "react";

export const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.text}>
          <div className={styles.title}>
              <h1>
                АВТОМОБИЛИ <br />
              </h1>
            <div className={styles.secondLine}>
              <h1>
              ИЗ КИТАЯ
              </h1>
              <span className={styles.label}>
                <i>в наличии и под заказ</i>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.body}>
          <div className={[styles.text, styles.secondText].join(" ")}>
            <p>
              ООО «Дружба Народов» занимается услугами по импорту машин из
              Китая. Наша компания ведет процесс растаможивания, следит за
              логистикой и обеспечивает комфортное и быстрое оформление и
              получение товара.
            </p>
            <div className={styles.contacts}>
              <div>
                <FaPhoneAlt />
                <span>+7-(915)-018-28-37</span>
              </div>
              <div>
                <FaEnvelope />
                <span>drujba_narodov1@mail.ru</span>
              </div>
            </div>
          </div>

          <div className={styles.image}>
            <img src={carImage} alt="Автомобиль" />
          </div>
        </div>
      </div>
      {/* </div> */}
    </section>
  );
};
