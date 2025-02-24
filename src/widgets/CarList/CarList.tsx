import React from "react";
import CarDetailCard from "@/entities/CarDetailCard/CarDetailCard";
import styles from "./CarList.module.scss";
import { CarResponseDto } from "@/shared/api/car/types";

interface CarListProps {
  cars: CarResponseDto[];
}

const CarList: React.FC<CarListProps> = ({ cars }) => {
  console.log(cars);
  
  return (
    <div className={styles.listContainer}>
      <h2>Найдено {cars.length} автомобилей</h2>
      <div className={styles.cardList}>
        {cars.map((car) => (
          <CarDetailCard key={car.id} car={car} onSubmit={() => {}} />
        ))}
      </div>
    </div>
  );
};

export default CarList;