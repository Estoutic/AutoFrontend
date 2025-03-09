import React, { useState } from "react";
import styles from "./AdminCarCard.module.scss";
import { CarResponseDto } from "@/shared/api/car/types";
import Button from "@/shared/ui/Button/Button";
import bmwFallback from "@/assets/bmw.png";

interface AdminCarCardProps {
  car: CarResponseDto;
  onEdit?: (car: CarResponseDto) => void;
  onManageTranslations?: (car: CarResponseDto) => void;
  onManagePhotos?: (car: CarResponseDto) => void;
  onDelete?: (car: CarResponseDto) => void;
}

const AdminCarCard: React.FC<AdminCarCardProps> = ({
  car,
  onEdit,
  onManageTranslations,
  onManagePhotos,
  onDelete,
}) => {
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
        <img src={images[currentIndex]} className={styles.mainImage} alt="Car" />

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

      <h3 className={styles.title}>{car.name}</h3>

        <div className={styles.details}>
          {car.engineCapacity} л / {car.mileage} км / {car.enginePower} л.с. /{" "}
          {car.engineType}
        </div>

        <div className={styles.price}>
          {car.price ? car.price.toLocaleString("ru-RU") : 0} руб.
        </div>

        <div className={styles.actions}>
          {onEdit && (
            <Button onClick={() => onEdit(car)}>Редактировать</Button>
          )}
          {onManageTranslations && (
            <Button onClick={() => onManageTranslations(car)}>
              Переводы
            </Button>
          )}
          {onManagePhotos && (
            <Button onClick={() => onManagePhotos(car)}>
              Фотографии
            </Button>
          )}
          {onDelete && (
            <Button variant="secondary" onClick={() => onDelete(car)}>
              Удалить
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCarCard;