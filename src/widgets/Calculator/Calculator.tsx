import React, { useState } from "react";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import Button from "@/shared/ui/Button/Button";
import styles from "./Calculator.module.scss";
import Text from "@/shared/ui/Text/Text";
import Dropdown from "@/shared/ui/Dropdown/Dropdown";
import InputField from "@/shared/ui/InputField/InputField";

import {
  CAR_AGE,
  CURRNECY_CODE,
  PERSON,
} from "@/shared/constants/calculatorOptions";
import { ENGINE_OPTIONS } from "@/shared/constants/carOptions";
import CalculatorCalculations from "../CalculatorCalculations/CalculatorCalculations";

const Calculator = () => {
  const [filters, setFilters] = useState({
    country: "",
    age: "",
    price: "",
    currency: "",
    engineType: "",
    volume: "",
    power: "",
    person: "",
  });

  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={styles.calculator}>
      <h2>
        Калькулятор таможенных <br />
        платежей за автомобиль
      </h2>

      <div className={styles.flexContainer}>
        <div className={styles.flexRow}>
          <Text>Рассчитать для</Text>
          <Button
            variant="secondary"
            classname={filters["country"] === "russia" ? "active" : ""}
            onClick={() => handleChange("country", "russia")}
          >
            Российская Федерация
            <span className={styles.flagIcon}>{getUnicodeFlagIcon("RU")}</span>
          </Button>
          <Button
            variant="secondary"
            classname={filters["country"] === "belarus" ? "active" : ""}
            onClick={() => handleChange("country", "belarus")}
          >
            Республика Беларусь
            <span className={styles.flagIcon}>{getUnicodeFlagIcon("BY")}</span>
          </Button>
        </div>

        {/* 2-я строка (3 элемента) */}
        <div className={styles.flexRow}>
          <Dropdown
            options={CAR_AGE}
            value={filters.age}
            onChange={(value) => handleChange("age", value)}
            placeholder="Возраст"
          />
          <div className={styles.inputContainer}>
            <InputField
              type="number"
              value={filters.price}
              onChange={(value) => handleChange("price", value)}
              placeholder="Цена"
            />
          </div>
          <Dropdown
            options={CURRNECY_CODE}
            value={filters.currency}
            onChange={(value) => handleChange("currency", value)}
            placeholder="Валюта"
          />
        </div>

        <div className={styles.flexRow}>
          <Dropdown
            options={ENGINE_OPTIONS}
            value={filters.engineType}
            onChange={(value) => handleChange("engineType", value)}
            placeholder="Тип двигателя"
          />
          <div className={styles.inputContainer}>
            <InputField
              type="number"
              value={filters.volume}
              onChange={(value) => handleChange("volume", value)}
              placeholder="Объем двигателя"
            />
          </div>
          <div className={styles.inputContainer}>
            <InputField
              type="number"
              value={filters.power}
              onChange={(value) => handleChange("power", value)}
              placeholder="Мощность двигателя"
            />
          </div>
        </div>

        <div className={styles.flexRow}>
          <div className={styles.faceContainer}>
            <Text>Расчет при ввозе</Text>
            <Dropdown
              options={PERSON}
              value={filters.person}
              onChange={(value) => handleChange("person", value)}
              placeholder="Лицо"
            />
          </div>
          <Button onClick={() => console.log(filters)}>Рассчитать</Button>
        </div>
      </div>
      <CalculatorCalculations/>
    </div>
  );
};

export default Calculator;
