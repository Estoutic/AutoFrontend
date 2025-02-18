import React from "react";
import styles from "./CarList.module.scss";
import { Car } from "@/shared/types/Car";
import CarDetailCard from "@/entities/CarDetailCard/CarDetailCard";

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

  const handleSubmit = () => {
    // Здесь можно задать логику обработки, например:
    // - открыть форму, отправить запрос, показать модалку и т.д.
    alert('Заявка принята!');
  };

const bmwX3: CarData = {
    title: 'BMW X3 25i xDrive III (G01) Рестайлинг 2024',
    condition: 'Новый',
    engine: '2.0 л / 245 л.с. / Бензин / Полный',
    transmission: 'Автомат',
    color: 'Белый',
    type: 'Внедорожник 5дв.',
    location: 'Москва',
    price: 9500000,
    imageUrl: 'https://via.placeholder.com/344x258?text=BMW+X3', // Замените на реальную картинку
  };

const CarList = () => {
  return (
    <div className={styles.cardList}>
     <CarDetailCard car={bmwX3} onSubmit={handleSubmit} />
     {/* <CarDetailCard car={bmwX3} onSubmit={handleSubmit} /> */}

    </div>
  );
};

export default CarList;