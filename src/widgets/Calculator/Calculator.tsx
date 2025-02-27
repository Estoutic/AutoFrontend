import React, { use, useState } from "react";
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
import { useTranslation } from "react-i18next";

const Calculator = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
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

  const onClick = () => {
    setVisible(!visible);
  };

  return (
    <div className={styles.calculator}>
      <h2>
        {t("calculator.titleLine1")} <br />
        {t("calculator.titleLine2")}
      </h2>

      <div className={styles.flexContainer}>
        <div className={styles.flexRow}>
          <Text>{t("calculator.calculateFor")}</Text>
          <Button
            variant="secondary"
            classname={filters["country"] === "russia" ? "active" : ""}
            onClick={() => handleChange("country", "russia")}
          >
            {t("calculator.russianFederation")}
            <span className={styles.flagIcon}>{getUnicodeFlagIcon("RU")}</span>
          </Button>
          <Button
            variant="secondary"
            classname={filters["country"] === "belarus" ? "active" : ""}
            onClick={() => handleChange("country", "belarus")}
          >
            {t("calculator.belarusRepublic")}
            <span className={styles.flagIcon}>{getUnicodeFlagIcon("BY")}</span>
          </Button>
        </div>

        {/* 2-я строка (3 элемента) */}
        <div className={styles.flexRow}>
          <Dropdown
            options={CAR_AGE}
            value={filters.age}
            onChange={(value) => handleChange("age", value)}
            placeholder={t("calculator.agePlaceholder")}
          />
          <div className={styles.inputContainer}>
            <InputField
              type="number"
              value={filters.price}
              onChange={(value) => handleChange("price", value)}
              placeholder={t("calculator.pricePlaceholder")}
            />
          </div>
          <Dropdown
            options={CURRNECY_CODE}
            value={filters.currency}
            onChange={(value) => handleChange("currency", value)}
            placeholder={t("calculator.currencyPlaceholder")}
          />
        </div>

        <div className={styles.flexRow}>
          <Dropdown
            options={ENGINE_OPTIONS}
            value={filters.engineType}
            onChange={(value) => handleChange("engineType", value)}
            placeholder={t("calculator.engineTypePlaceholder")}
          />
          <div className={styles.inputContainer}>
            <InputField
              type="number"
              value={filters.volume}
              onChange={(value) => handleChange("volume", value)}
              placeholder={t("calculator.volumePlaceholder")}
            />
          </div>
          <div className={styles.inputContainer}>
            <InputField
              type="number"
              value={filters.power}
              onChange={(value) => handleChange("power", value)}
              placeholder={t("calculator.powerPlaceholder")}
            />
          </div>
        </div>

        <div className={styles.flexRow}>
          <div className={styles.faceContainer}>
            <Text>{t("calculator.importCalculation")}</Text>
            <Dropdown
              options={PERSON}
              value={filters.person}
              onChange={(value) => handleChange("person", value)}
              placeholder={t("calculator.personPlaceholder")}
            />
          </div>
          <Button onClick={onClick}>{t("calculator.calculateButton")}</Button>
        </div>
      </div>
      {visible ? <CalculatorCalculations /> : <></>}
    </div>
  );
};

export default Calculator;
