import React, { useState } from "react";
import styles from "./CarFilter.module.scss";
import Dropdown from "@/shared/ui/Dropdown/Dropdown";
import InputField from "@/shared/ui/InputField/InputField";
import Button from "@/shared/ui/Button/Button";
import {
  BODY_OPTIONS,
  DRIVE_OPTIONS,
  ENGINE_OPTIONS,
  STEERING_OPTIONS,
  TRANSMISSION_OPTIONS,
  OWNERS_COUNT,
} from "@/shared/constants/carOptions";

const CITY_OPTIONS = [
  { value: "moscow", labelKey: "Москва" },
  { value: "spb", labelKey: "Санкт-Петербург" },
];

const CarFilter = () => {
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    generation: "",
    bodyType: "",
    engineType: "",
    transmission: "",
    driveType: "",
    steeringPosition: "",
    priceFrom: "",
    priceTo: "",
    yearFrom: "",
    yearTo: "",
    volumeFrom: "",
    volumeTo: "",
    powerFrom: "",
    powerTo: "",
    mileageFrom: "",
    mileageTo: "",
    owners: "",
    city: "",
  });

  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={styles.filterContainer}>
      <h2>
        Каталог автомобилей: <br /> технические характеристики
      </h2>

      <div className={styles.filterGrid}>
        <Dropdown
          options={BODY_OPTIONS}
          value={filters.brand}
          onChange={(value) => handleChange("brand", value)}
          placeholder="Марка"
        />
        <Dropdown
          options={BODY_OPTIONS}
          value={filters.model}
          onChange={(value) => handleChange("model", value)}
          placeholder="Модель"
        />
        <Dropdown
          options={BODY_OPTIONS}
          value={filters.generation}
          onChange={(value) => handleChange("generation", value)}
          placeholder="Поколение"
        />
       
        <div className={styles.intervalContainer}>
          <InputField
            type="number"
            value={filters.priceFrom}
            onChange={(value) => handleChange("priceFrom", value)}
            placeholder="Цена от, ₽"
          />
          <InputField
            type="number"
            value={filters.priceTo}
            onChange={(value) => handleChange("priceTo", value)}
            placeholder="Цена до, ₽"
          />
        </div>
        <div className={styles.intervalContainer}>
          <InputField
            type="number"
            value={filters.yearFrom}
            onChange={(value) => handleChange("yearFrom", value)}
            placeholder="Год от"
          />
          <InputField
            type="number"
            value={filters.yearTo}
            onChange={(value) => handleChange("yearTo", value)}
            placeholder="Год до"
          />
        </div>
        <Dropdown
          options={TRANSMISSION_OPTIONS}
          value={filters.transmission}
          onChange={(value) => handleChange("transmission", value)}
          placeholder="Тип коробки передач"
        />
        <Dropdown
          options={BODY_OPTIONS}
          value={filters.bodyType}
          onChange={(value) => handleChange("bodyType", value)}
          placeholder="Тип кузова"
        />

        <Dropdown
          options={ENGINE_OPTIONS}
          value={filters.engineType}
          onChange={(value) => handleChange("engineType", value)}
          placeholder="Тип двигателя"
        />
         <div className={styles.intervalContainer}>
          <InputField
            type="number"
            value={filters.powerFrom}
            onChange={(value) => handleChange("powerFrom", value)}
            placeholder="Мощность от, л.с."
          />
          <InputField
            type="number"
            value={filters.powerTo}
            onChange={(value) => handleChange("powerTo", value)}
            placeholder="Мощность до, л.с."
          />
        </div>
        <Dropdown
          options={DRIVE_OPTIONS}
          value={filters.driveType}
          onChange={(value) => handleChange("driveType", value)}
          placeholder="Тип привода"
        />
          <div className={styles.intervalContainer}>
          <InputField
            type="number"
            value={filters.volumeFrom}
            onChange={(value) => handleChange("volumeFrom", value)}
            placeholder="Объем двигателя от, л"
          />
          <InputField
            type="number"
            value={filters.volumeTo}
            onChange={(value) => handleChange("volumeTo", value)}
            placeholder="Объем двигателя до, л"
          />
        </div>
        <Dropdown
          options={STEERING_OPTIONS}
          value={filters.steeringPosition}
          onChange={(value) => handleChange("steeringPosition", value)}
          placeholder="Расположение руля"
        /> 
         <Dropdown
          options={OWNERS_COUNT}
          value={filters.owners}
          onChange={(value) => handleChange("owners", value)}
          placeholder="Количество владельцев"
        />
        <div className={styles.intervalContainer}>
          <InputField
            type="number"
            value={filters.mileageFrom}
            onChange={(value) => handleChange("mileageFrom", value)}
            placeholder="Пробег от, км"
          />
          <InputField
            type="number"
            value={filters.mileageTo}
            onChange={(value) => handleChange("mileageTo", value)}
            placeholder="Пробег до, км"
          />
        </div>
        <Dropdown
          options={CITY_OPTIONS}
          value={filters.city}
          onChange={(value) => handleChange("city", value)}
          placeholder="Город"
        />
       <div></div>
        <Button onClick={() => console.log(filters)}>
          Показать XXX моделей
        </Button>
      </div>
    </div>
  );
};

export default CarFilter;
