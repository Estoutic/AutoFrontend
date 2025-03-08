import { Hero } from "@/widgets/Hero";
import React from "react";
import styles from "./HomePage.module.scss";
import CarSlider from "@/widgets/CarSlider/CarSlider";
import CarFilter from "@/widgets/FilterWidget/CarFilter";
import CarDetailCard from "@/entities/CarDetailCard/CarDetailCard";
import { Car } from "@/shared/types/Car";
import CarList from "@/widgets/CarList/CarList";
import Calculator from "@/widgets/Calculator/Calculator";
import CarCatalog from "@/features/CarCatalog/CarCatalog";

export const HomePage = () => {
  return (
    <main className={styles.home}>
      <Hero />
      {/* <CarCard image={carImage} name="BMW X3" price="9 000 000 руб." /> */}
      <CarSlider />
      <CarCatalog></CarCatalog>
      <Calculator></Calculator>
    </main>
  );
};
