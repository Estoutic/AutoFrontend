import React, { useState } from "react";
import styles from "./CarCatalogPage.module.scss";
import CarCatalog from "@/features/CarCatalog/CarCatalog";

const CarCatalogPage: React.FC = () => {
  return (
    <div className={styles.catalog}>
      <CarCatalog></CarCatalog>
    </div>
  );
};

export default CarCatalogPage;
