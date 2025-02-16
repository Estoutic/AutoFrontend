import React, { useRef } from "react";
import styles from "./CarSlider.module.scss";
import CarCard from "@/shared/ui/CarCard/CarCard";
import carImage from "@/assets/bmw.png";

const carList = [
  { id: 1, name: "BMW X3", price: "9 000 000 руб." },
  { id: 2, name: "MERCEDES-BENZ GLC 260 L4", price: "9 500 000 руб." },
  { id: 3, name: "VOLVO XC60", price: "7 250 000 руб." },
  { id: 4, name: "TOYOTA CAMRY SPORT", price: "4 600 000 руб." },
];

const CarSlider = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.slider} ref={sliderRef}>
        {carList.map((car) => (
          <CarCard key={car.id} image={carImage} name={car.name} price={car.price} />
        ))}
      </div>
    </div>
  );
};

export default CarSlider;