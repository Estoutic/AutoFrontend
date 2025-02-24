import React, { useState } from "react";
import styles from "./CarDetailCard.module.scss";
import { CarResponseDto } from "@/shared/api/car/types";
import Button from "@/shared/ui/Button/Button";
import bmwFallback from "@/assets/bmw.png";

interface CarCardProps {
  car: CarResponseDto;
  onSubmit?: () => void;
}

const CarDetailCard: React.FC<CarCardProps> = ({ car, onSubmit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = car.images?.length ? car.images : [bmwFallback];
  // Если хотим ограничить количество картинок (для рисинок):
  const maxCount = 10;
  const displayedImages = images.slice(0, maxCount);

  // При наведении/клике на полосы (если надо)
  const handleHover = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={styles.carCard}>
      {/* Верхняя часть: блок под фото/слайдер */}
      <div className={styles.imageWrapper}>
        {/* Главное изображение */}
        <img
          src={images[currentIndex]}
          alt={car.name}
          className={styles.mainImage}
        />

        {/* Если есть стрелки-переключалки < >, можно добавить их */}
        {/* <button className={styles.sliderButton} onClick={handlePrev}>&lt;</button>
        <button className={styles.sliderButton} onClick={handleNext}>&gt;</button> */}

        {/* Если используете «рисинки» (hoverZones) */}
        <div className={styles.hoverZones}>
          {displayedImages.map((_, index) => (
            <div
              key={index}
              className={styles.hoverZone}
              onMouseEnter={() => handleHover(index)}
            >
              <div
                className={
                  index === currentIndex
                    ? `${styles.risinka} ${styles.active}`
                    : styles.risinka
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.infoWrapper}>
        <h3 className={styles.title}>{car.name || "Без названия"}</h3>
        <div className={styles.details}>
          {car.engineCapacity} л / {car.mileage} км / {car.enginePower} л.с. /{" "}
          {car.engineType}
        </div>
        <div className={styles.price}>
          {car.price ? car.price.toLocaleString("ru-RU") : 0} руб.
        </div>
        {/* {car.city && <div className={styles.location}>{car.city}</div>} */}

        <div className={styles.actions}>
          <Button onClick={onSubmit}>Оставить заявку</Button>
        </div>
      </div>
    </div>
  );
};

export default CarDetailCard;