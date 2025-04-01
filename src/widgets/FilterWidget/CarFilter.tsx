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
} from "@/shared/constants/carOptions";
import { CarFilterDto } from "@/shared/api/car/types";
import { useTranslation } from "react-i18next";
import { useGetAllFilters } from "@/shared/api/carModel/hooks";

interface CarFilterProps {
  filter: CarFilterDto;
  onChange: (newFilter: CarFilterDto) => void;
  onApplyFilter: () => void;
  onClearFilters: () => void;
}

const CarFilter: React.FC<CarFilterProps> = ({ filter, onChange, onApplyFilter, onClearFilters }) => {
  const { t } = useTranslation();
  const { data: filterData, isLoading } = useGetAllFilters();

  // Updated handleChange function to properly handle string to number conversions
  const handleChange = (key: keyof CarFilterDto, value: string | number) => {
    // Define numeric fields
    const numericFields: Array<keyof CarFilterDto> = [
      'priceFrom', 'priceTo', 'yearFrom', 'yearTo', 
      'enginePowerFrom', 'enginePowerTo', 
      'engineCapacityFrom', 'engineCapacityTo',
      'mileageFrom', 'mileageTo'
    ];
    
    // Process value based on field type
    const processedValue = typeof value === 'string' && numericFields.includes(key)
      ? value === '' ? null : Number(value) // Convert to number or null
      : value;
      
    onChange({
      ...filter,
      [key]: processedValue,
    });
  };

  return (
    <div className={styles.filterContainer}>
      <h2>
        {t("carFilter.titleLine1")} <br /> {t("carFilter.titleLine2")}
      </h2>

      <div className={styles.filterGrid}>
        <div className={styles.inputContainer}>
          <Dropdown
            options={
              filterData
                ? filterData.brands.map((brand) => ({ value: brand, labelKey: brand }))
                : []
            }
            value={filter.brand || ""}
            onChange={(val) => {
              handleChange("brand", val);
              // Reset dependent fields
              handleChange("model", "");
              handleChange("generation", "");
            }}
            placeholder={t("carFilter.brandPlaceholder")}
            disabled={isLoading}
          />
        </div>
        <div className={styles.inputContainer}>
          <Dropdown
            options={
              filterData && filter.brand
                ? filterData.models[filter.brand]?.map((model) => ({ value: model, labelKey: model })) ||
                  []
                : []
            }
            value={filter.model || ""}
            onChange={(val) => {
              handleChange("model", val);
              handleChange("generation", "");
            }}
            placeholder={t("carFilter.modelPlaceholder")}
            disabled={isLoading || !filter.brand}
          />
        </div>
        <div className={styles.inputContainer}>
          <Dropdown
            options={
              filterData && filter.model
                ? filterData.generations[filter.model]?.map((gen) => ({ value: gen, labelKey: gen })) ||
                  []
                : []
            }
            value={filter.generation || ""}
            onChange={(val) => handleChange("generation", val)}
            placeholder={t("carFilter.generationPlaceholder")}
            disabled={isLoading || !filter.model}
          />
        </div>

        <div className={styles.intervalContainer}>
          <InputField
            type="number"
            value={filter.priceFrom ?? ""}
            onChange={(val) => handleChange("priceFrom", val)}
            placeholder={t("carFilter.priceFromPlaceholder")}
          />
          <InputField
            type="number"
            value={filter.priceTo ?? ""}
            onChange={(val) => handleChange("priceTo", val)}
            placeholder={t("carFilter.priceToPlaceholder")}
          />
        </div>

        <div className={styles.intervalContainer}>
          <InputField
            type="number"
            value={filter.yearFrom ?? ""}
            onChange={(val) => handleChange("yearFrom", val)}
            placeholder={t("carFilter.yearFromPlaceholder")}
          />
          <InputField
            type="number"
            value={filter.yearTo ?? ""}
            onChange={(val) => handleChange("yearTo", val)}
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
            onChange={(val) => handleChange("enginePowerFrom", val)}
            placeholder={t("carFilter.enginePowerFromPlaceholder")}
          />
          <InputField
            type="number"
            value={filter.enginePowerTo ?? ""}
            onChange={(val) => handleChange("enginePowerTo", val)}
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
            onChange={(val) => handleChange("engineCapacityFrom", val)}
            placeholder={t("carFilter.engineCapacityFromPlaceholder")}
          />
          <InputField
            type="number"
            value={filter.engineCapacityTo ?? ""}
            onChange={(val) => handleChange("engineCapacityTo", val)}
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
            onChange={(val) => handleChange("mileageFrom", val)}
            placeholder={t("carFilter.mileageFromPlaceholder")}
          />
          <InputField
            type="number"
            value={filter.mileageTo ?? ""}
            onChange={(val) => handleChange("mileageTo", val)}
            placeholder={t("carFilter.mileageToPlaceholder")}
          />
        </div>

        <div className={styles.buttonContainer}>
          <Button 
            onClick={onApplyFilter}
            className={styles.showButton}
          >
            {t("carFilter.showButton") || "Показать"}
          </Button>
          <Button 
            onClick={onClearFilters}
            className={styles.clearButton}
          >
            {t("carFilter.clearButton") || "Очистить"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CarFilter;