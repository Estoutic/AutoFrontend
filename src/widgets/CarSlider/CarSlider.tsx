import React, { useRef, useState } from "react";
import styles from "./CarSlider.module.scss";
import CarCard from "@/shared/ui/CarCard/CarCard";
import carImage from "@/assets/bmw.png";
import { CarFilterDto, CarResponseDto } from "@/shared/api/car/types";
import { useGetAllCars } from "@/shared/api/car/hooks";


const CarSlider = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const [filter, setFilter] = useState<CarFilterDto>({});

  const { data, isLoading, isError } = useGetAllCars(filter);

  const cars = data?.content || [];

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.slider} ref={sliderRef}>
        {cars.map((car) => (
          <CarCard
            key={car.id}
            image={car.images ? car.images[0] : carImage}
            name={car.name}
            price={car.price ? car.price : 0}
          />
        ))}
      </div>
    </div>
  );
};

export default CarSlider;
