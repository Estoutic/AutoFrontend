import { Hero } from "@/widgets/Hero";
import React from "react";
import styles from "./HomePage.module.scss";
import CarSlider from "@/widgets/CarSlider/CarSlider";

export const HomePage = () => {
  return (
    <main className={styles.home}> 
      <Hero />
      {/* <CarCard image={carImage} name="BMW X3" price="9 000 000 руб." /> */}
      <CarSlider />
    </main>
  );
};
