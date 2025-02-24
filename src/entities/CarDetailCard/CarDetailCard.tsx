import React, { useState } from "react";
import styles from "./CarDetailCard.module.scss";
import Button from "@/shared/ui/Button/Button";
import { CarResponseDto } from "@/shared/api/car/types";
import bmwFallback from "@/assets/bmw.png";

interface CarCardProps {
  car: CarResponseDto;
  onSubmit?: () => void;
}

const CarDetailCard: React.FC<CarCardProps> = ({ car, onSubmit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = car.images && car.images.length > 0 ? car.images : [bmwFallback];
  console.log("Links:", JSON.stringify(images, null, 2));
  

  const handlePrev = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className={styles.carCard}>
      <div className={styles.imageWrapper}>
        {/* Кнопка "Назад" */}
        {images.length > 1 && (
          <button className={styles.sliderButton} onClick={handlePrev}>
            &lt;
          </button>
        )}

        {/* Сами слайды */}
        <div className={styles.slider}>
          {images.map((imgUrl, index) => (
            <div
              key={index}
              className={`${styles.slide} ${
                index === currentIndex ? styles.active : ""
              }`}
            >
              <img src={imgUrl} alt={car.name} className={styles.carImage} />
            </div>
          ))}
        </div>

        {/* Кнопка "Вперёд" */}
        {images.length > 1 && (
          <button className={styles.sliderButton} onClick={handleNext}>
            &gt;
          </button>
        )}
      </div>

      <div className={styles.infoWrapper}>
        <h3 className={styles.title}>{car.name}</h3>
        <p className={styles.condition}>Новый</p>
        <p className={styles.details}>
          {car.engineCapacity} л / {car.enginePower} л.с. / {car.engineType} /{" "}
          {car.transmissionType}
          <br />
          {car.color}
          <br /> {car.bodyType}
        </p>
        <div className={styles.locationAndPrice}>
          <span className={styles.price}>
            {car.price ? car.price.toLocaleString("ru-RU") : 0} руб.
          </span>
        </div>
        <Button onClick={onSubmit}>Оставить заявку</Button>
      </div>
    </div>
  );
};

export default CarDetailCard;