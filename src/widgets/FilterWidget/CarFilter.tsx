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
import { useTranslation } from "react-i18next";

interface CarFilterProps {
  filter: CarFilterDto;
  onChange: (newFilter: CarFilterDto) => void;
}

const CarFilter: React.FC<CarFilterProps> = ({ filter, onChange }) => {
  const { t } = useTranslation();

  const handleChange = (key: keyof CarFilterDto, value: string | number) => {
    onChange({
      ...filter,
      [key]: value,
    });
  };

  return (
    <div className={styles.filterContainer}>
      <h2>
        {t("carFilter.titleLine1")} <br /> {t("carFilter.titleLine2")}
      </h2>

      <div className={styles.filterGrid}>
        <div className={styles.inputContainer}>
          <InputField
            type="text"
            value={filter.brand || ""}
            onChange={(val) => handleChange("brand", val)}
            placeholder={t("carFilter.brandPlaceholder")}
          />
        </div>
        <div className={styles.inputContainer}>
          <InputField
            type="text"
            value={filter.model || ""}
            onChange={(val) => handleChange("model", val)}
            placeholder={t("carFilter.modelPlaceholder")}
          />
        </div>
        <div className={styles.inputContainer}>
          <InputField
            type="text"
            value={filter.generation || ""}
            onChange={(val) => handleChange("generation", val)}
            placeholder={t("carFilter.generationPlaceholder")}
          />
        </div>

        <div className={styles.intervalContainer}>
          <InputField
            type="number"
            value={filter.priceFrom ?? ""}
            onChange={(val) => handleChange("priceFrom", +val)}
            placeholder={t("carFilter.priceFromPlaceholder")}
          />
          <InputField
            type="number"
            value={filter.priceTo ?? ""}
            onChange={(val) => handleChange("priceTo", +val)}
            placeholder={t("carFilter.priceToPlaceholder")}
          />
        </div>

        <div className={styles.intervalContainer}>
          <InputField
            type="number"
            value={filter.yearFrom ?? ""}
            onChange={(val) => handleChange("yearFrom", +val)}
            placeholder={t("carFilter.yearFromPlaceholder")}
          />
          <InputField
            type="number"
            value={filter.yearTo ?? ""}
            onChange={(val) => handleChange("yearTo", +val)}
            placeholder={t("carFilter.yearToPlaceholder")}
          />
        </div>

        <Dropdown
          options={TRANSMISSION_OPTIONS}
          value={filter.transmission || ""}
          onChange={(val) => handleChange("transmission", val)}
          placeholder={t("carFilter.transmissionPlaceholder")}
        />
        <Dropdown
          options={BODY_OPTIONS}
          value={filter.bodyType || ""}
          onChange={(val) => handleChange("bodyType", val)}
          placeholder={t("carFilter.bodyTypePlaceholder")}
        />

        <Dropdown
          options={ENGINE_OPTIONS}
          value={filter.engineType || ""}
          onChange={(val) => handleChange("engineType", val)}
          placeholder={t("carFilter.engineTypePlaceholder")}
        />

        <div className={styles.intervalContainer}>
          <InputField
            type="number"
            value={filter.enginePowerFrom ?? ""}
            onChange={(val) => handleChange("enginePowerFrom", +val)}
            placeholder={t("carFilter.enginePowerFromPlaceholder")}
          />
          <InputField
            type="number"
            value={filter.enginePowerTo ?? ""}
            onChange={(val) => handleChange("enginePowerTo", +val)}
            placeholder={t("carFilter.enginePowerToPlaceholder")}
          />
        </div>

        <Dropdown
          options={DRIVE_OPTIONS}
          value={filter.drive || ""}
          onChange={(val) => handleChange("drive", val)}
          placeholder={t("carFilter.drivePlaceholder")}
        />

        <div className={styles.intervalContainer}>
          <InputField
            type="number"
            value={filter.engineCapacityFrom ?? ""}
            onChange={(val) => handleChange("engineCapacityFrom", +val)}
            placeholder={t("carFilter.engineCapacityFromPlaceholder")}
          />
          <InputField
            type="number"
            value={filter.engineCapacityTo ?? ""}
            onChange={(val) => handleChange("engineCapacityTo", +val)}
            placeholder={t("carFilter.engineCapacityToPlaceholder")}
          />
        </div>

        <Dropdown
          options={STEERING_OPTIONS}
          value={filter.steeringPosition || ""}
          onChange={(val) => handleChange("steeringPosition", val)}
          placeholder={t("carFilter.steeringPositionPlaceholder")}
        />

        <div className={styles.intervalContainer}>
          <InputField
            type="number"
            value={filter.mileageFrom ?? ""}
            onChange={(val) => handleChange("mileageFrom", +val)}
            placeholder={t("carFilter.mileageFromPlaceholder")}
          />
          <InputField
            type="number"
            value={filter.mileageTo ?? ""}
            onChange={(val) => handleChange("mileageTo", +val)}
            placeholder={t("carFilter.mileageToPlaceholder")}
          />
        </div>

        <Button onClick={() => console.log("Текущий фильтр:", filter)}>
          {t("carFilter.showButton")}
        </Button>
      </div>
    </div>
  );
};

export default CarFilter;