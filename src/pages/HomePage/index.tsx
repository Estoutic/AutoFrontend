import { Hero } from "@/widgets/Hero";
import React from "react";
import styles from "./HomePage.module.scss";
import CarFilter from "@/widgets/FilterWidget/CarFilter";
import CarDetailCard from "@/entities/CarDetailCard/CarDetailCard";
import { Car } from "@/shared/types/Car";
import CarList from "@/widgets/CarList/CarList";
import Calculator from "@/widgets/Calculator/Calculator";
import CarCatalog from "@/features/CarCatalog/CarCatalog";
import CarCarousel from "@/widgets/CarCarousel/CarCarousel";
import { TestNotificationComponent } from "@/app/TestNotificationComponent";

export const HomePage = () => {
  return (
    <main className={styles.home}>
      {/* <TestNotificationComponent/> */}
      <Hero />
      {/* <CarCard image={carImage} name="BMW X3" price="9 000 000 руб." /> */}
      <CarCarousel />
      <CarCatalog></CarCatalog>
      <Calculator></Calculator>
    </main>
  );
};
