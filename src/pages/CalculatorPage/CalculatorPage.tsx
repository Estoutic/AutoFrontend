import { Hero } from "@/widgets/Hero";
import React from "react";
import styles from "./CalculatorPage.module.scss";
import Calculator from "@/widgets/Calculator/Calculator";

export const CalculatorPage = () => {
  return (
    <main className={styles.calculator}>
      <Calculator></Calculator>
    </main>
  );
};
