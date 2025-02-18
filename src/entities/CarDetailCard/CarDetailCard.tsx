import React from 'react';
import styles from './CarDetailCard.module.scss';
import carImage from "@/assets/bmw.png";
import Button from '@/shared/ui/Button/Button';

interface CarData {
    title: string;        // Например: "BMW X3 25i xDrive III (G01) Рестайлинг 2024"
    condition: string;    // Например: "Новый"
    engine: string;       // Например: "2.0 л / 245 л.с. / Бензин / Полный"
    transmission: string; // Например: "Автомат"
    color: string;        // Например: "Белый"
    type: string;         // Например: "Внедорожник 5дв."
    location: string;     // Например: "Москва"
    price: number;        // Например: 9500000
    imageUrl: string;     // Ссылка или путь к картинке
  }

interface CarCardProps {
  car: CarData;
  onSubmit?: () => void; // обработчик клика по кнопке "Оставить заявку"
}

const CarDetailCard: React.FC<CarCardProps> = ({ car, onSubmit }) => {
  const {
    title,
    condition,
    engine,
    transmission,
    color,
    type,
    location,
    price,
    imageUrl,
  } = car;

  return (
    <div className={styles.carCard}>
      <div className={styles.imageWrapper}>
        <img src={carImage} alt={title} className={styles.carImage} />
      </div>
      <div className={styles.infoWrapper}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.condition}>{condition}</p>
        <p className={styles.details}>
          {engine} / {transmission}<br />
          {color} / {type}
        </p>
        <div className={styles.locationAndPrice}>
          <span className={styles.location}>{location}</span>
          <span className={styles.price}>
            {price.toLocaleString('ru-RU')} руб.
          </span>
        </div>
        <Button  onClick={onSubmit}>
          Оставить заявку
        </Button>
      </div>
    </div>
  );
};

export default CarDetailCard;