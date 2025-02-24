import React from "react";
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
import { CarFilterDto } from "@/shared/api/car/types";

const CITY_OPTIONS = [
  { value: "moscow", labelKey: "Москва" },
  { value: "spb", labelKey: "Санкт-Петербург" },
];

interface CarFilterProps {
  filter: CarFilterDto;
  onChange: (newFilter: CarFilterDto) => void;
}

const CarFilter: React.FC<CarFilterProps> = ({ filter, onChange }) => {
  const handleChange = (key: keyof CarFilterDto, value: string | number) => {
    onChange({
      ...filter,
      [key]: value,
    });
  };

  return (
    <div className={styles.filterContainer}>
      <h2>
        Каталог автомобилей: <br /> технические характеристики
      </h2>

      <div className={styles.filterGrid}>
        <div className={styles.inputContainer}>
          <InputField
            type="text"
            value={filter.brand || ""}
            onChange={(val) => handleChange("brand", val)}
            placeholder="Марка"
          />
        </div>
        <div className={styles.inputContainer}>
          <InputField
            type="text"
            value={filter.model || ""}
            onChange={(val) => handleChange("model", val)}
            placeholder="Модель"
          />
        </div>
        <div className={styles.inputContainer}>
          <InputField
            type="text"
            value={filter.generation || ""}
            onChange={(val) => handleChange("generation", val)}
            placeholder="Поколение"
          />
        </div>

        <div className={styles.intervalContainer}>
          <InputField
            type="number"
            value={filter.priceFrom ?? ""}
            onChange={(val) => handleChange("priceFrom", +val)}
            placeholder="Цена от, ₽"
          />
          <InputField
            type="number"
            value={filter.priceTo ?? ""}
            onChange={(val) => handleChange("priceTo", +val)}
            placeholder="Цена до, ₽"
          />
        </div>

        <div className={styles.intervalContainer}>
          <InputField
            type="number"
            value={filter.yearFrom ?? ""}
            onChange={(val) => handleChange("yearFrom", +val)}
            placeholder="Год от"
          />
          <InputField
            type="number"
            value={filter.yearTo ?? ""}
            onChange={(val) => handleChange("yearTo", +val)}
            placeholder="Год до"
          />
        </div>

        <Dropdown
          options={TRANSMISSION_OPTIONS}
          value={filter.transmission || ""}
          onChange={(val) => handleChange("transmission", val)}
          placeholder="Тип коробки передач"
        />
        <Dropdown
          options={BODY_OPTIONS}
          value={filter.bodyType || ""}
          onChange={(val) => handleChange("bodyType", val)}
          placeholder="Тип кузова"
        />

        <Dropdown
          options={ENGINE_OPTIONS}
          value={filter.engineType || ""}
          onChange={(val) => handleChange("engineType", val)}
          placeholder="Тип двигателя"
        />

        <div className={styles.intervalContainer}>
          <InputField
            type="number"
            value={filter.enginePowerFrom ?? ""}
            onChange={(val) => handleChange("enginePowerFrom", +val)}
            placeholder="Мощность от, л.с."
          />
          <InputField
            type="number"
            value={filter.enginePowerTo ?? ""}
            onChange={(val) => handleChange("enginePowerTo", +val)}
            placeholder="Мощность до, л.с."
          />
        </div>

        <Dropdown
          options={DRIVE_OPTIONS}
          value={filter.drive || ""}
          onChange={(val) => handleChange("drive", val)}
          placeholder="Тип привода"
        />

        <div className={styles.intervalContainer}>
          <InputField
            type="number"
            value={filter.engineCapacityFrom ?? ""}
            onChange={(val) => handleChange("engineCapacityFrom", +val)}
            placeholder="Объем двигателя от, л"
          />
          <InputField
            type="number"
            value={filter.engineCapacityTo ?? ""}
            onChange={(val) => handleChange("engineCapacityTo", +val)}
            placeholder="Объем двигателя до, л"
          />
        </div>

        <Dropdown
          options={STEERING_OPTIONS}
          value={filter.steeringPosition || ""}
          onChange={(val) => handleChange("steeringPosition", val)}
          placeholder="Расположение руля"
        />

        {/* <Dropdown
          options={OWNERS_COUNT}
          value={filter.ownersCountFrom}
          onChange={(val) => handleChange("ownersCountFrom", +val)}
          placeholder="Количество владельцев (минимум)"
        /> */}

        <div className={styles.intervalContainer}>
          <InputField
            type="number"
            value={filter.mileageFrom ?? ""}
            onChange={(val) => handleChange("mileageFrom", +val)}
            placeholder="Пробег от, км"
          />
          <InputField
            type="number"
            value={filter.mileageTo ?? ""}
            onChange={(val) => handleChange("mileageTo", +val)}
            placeholder="Пробег до, км"
          />
        </div>

        <Dropdown
          options={CITY_OPTIONS}
          value={filter.city || ""}
          onChange={(val) => handleChange("city", val)}
          placeholder="Город"
        />

        <div></div>
        <Button onClick={() => console.log("Текущий фильтр:", filter)}>
          Показать
        </Button>
      </div>
    </div>
  );
};

export default CarFilter;
