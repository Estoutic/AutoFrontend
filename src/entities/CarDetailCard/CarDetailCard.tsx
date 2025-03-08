import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./CarDetailCard.module.scss";
import { CarResponseDto } from "@/shared/api/car/types";
import Button from "@/shared/ui/Button/Button";
import bmwFallback from "@/assets/bmw.png";

interface CarCardProps {
  car: CarResponseDto;
  onSubmit?: () => void;
  hideSubmitButton?: boolean;
}

const CarDetailCard: React.FC<CarCardProps> = ({
  car,
  onSubmit,
  hideSubmitButton = false,
}) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = car.images?.length ? car.images : [bmwFallback];
  const maxCount = 10;
  const displayedImages = images.slice(0, maxCount);

  const handleHover = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={styles.carCard}>
      <div className={styles.imageWrapper}>
        <img
          src={images[currentIndex]}
          className={styles.mainImage}
        />

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
        {/* <h3 className={styles.title}>{car. || t("carDetail.untitled")}</h3> */}
        <div className={styles.details}>
          {car.engineCapacity} {t("carDetail.liter")} / {car.mileage}{" "}
          {t("carDetail.kilometer")} / {car.enginePower}{" "}
          {t("carDetail.horsepower")} / {car.engineType}
        </div>
        <div className={styles.price}>
          {car.price ? car.price.toLocaleString("ru-RU") : 0}{" "}
          {t("carDetail.currency")}
        </div>

        <div className={styles.actions}>
          {!hideSubmitButton && (
            <Button onClick={onSubmit}>{t("carDetail.submitButton")}</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetailCard;
