import { Hero } from "@/widgets/Hero";
import React from "react";
import styles from "./HomePage.module.scss";
import CarSlider from "@/widgets/CarSlider/CarSlider";
import CarFilter from "@/widgets/FilterWidget/CarFilter";
import CarDetailCard from "@/entities/CarDetailCard/CarDetailCard";
import { Car } from "@/shared/types/Car";
import CarList from "@/widgets/CarList/CarList";



export const HomePage = () => {

 
const mockCar: Car = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  carModelId: "550e8400-e29b-41d4-a716-446655440001",
  year: 2024,
  description: "BMW X3 25i xDrive III (G01) Рестайлинг",
  color: "Белый",
  mileage: 10000,
  ownersCount: 1,
  transmissionType: "Автоматическая",
  bodyType: "Внедорожник 5 дверей",
  enginePower: "245 л.с.",
  engineType: "Бензиновый",
  driveType: "Полный привод",
  engineCapacity: "2.0 л",
  steeringPosition: "Левый руль",
  seatsCount: 5,
  price: 9500000,
  isAvailable: true,
  createdAt: "2024-02-20T12:00:00Z",
};
  return (
    <main className={styles.home}>
      <Hero />
      {/* <CarCard image={carImage} name="BMW X3" price="9 000 000 руб." /> */}
      <CarSlider />
      <CarFilter />
      {/* <CarDetailCard car={mockCar} /> */}
      <CarList cars={[mockCar, mockCar,mockCar]}></CarList>
    </main>
  );
};
