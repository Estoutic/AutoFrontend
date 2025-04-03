import React, { useEffect } from "react";
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

  // Debug: log filter data when it changes
  useEffect(() => {
    if (filterData) {
      console.log("Filter data loaded:", filterData);
      console.log("Available brands:", filterData.brands);
      if (filter.brand) {
        console.log("Models for selected brand:", filterData.models[filter.brand]);
      }
      if (filter.model) {
        console.log("Generations for selected model:", filterData.generations[filter.model]);
      }
    }
  }, [filterData, filter.brand, filter.model]);

  // Unified filter update function
  const updateFilterField = (field: keyof CarFilterDto, value: string) => {
    if (field === "brand") {
      onChange({
        ...filter,
        brand: value,
        model: "",
        generation: ""
      });
    } else if (field === "model") {
      onChange({
        ...filter,
        model: value,
        generation: ""
      });
    } else {
      onChange({
        ...filter,
        [field]: value
      });
    }
  };

  // Handle number field changes
  const handleNumberChange = (key: keyof CarFilterDto) => (value: string | number) => {
    // Define numeric fields
    const numericFields: Array<keyof CarFilterDto> = [
      'priceFrom', 'priceTo', 'yearFrom', 'yearTo', 
      'enginePowerFrom', 'enginePowerTo', 
      'engineCapacityFrom', 'engineCapacityTo',
      'mileageFrom', 'mileageTo'
    ];
    
    let processedValue: string | number | null = value;
    
    // Convert empty strings to null for numeric fields
    if (typeof value === 'string' && numericFields.includes(key)) {
      processedValue = value === '' ? null : Number(value);
    }
      
    onChange({
      ...filter,
      [key]: processedValue,
    });
  };
  
  // Handle direct input from an event
  const handleInputEvent = (key: keyof CarFilterDto) => (e: React.ChangeEvent<HTMLInputElement>) => {
    handleNumberChange(key)(e.target.value);
  };

  // Prepare brand options ensuring they are not undefined
  const brandOptions = filterData?.brands
    ? filterData.brands.map(brand => ({ value: brand, labelKey: brand }))
    : [];

  // Prepare model options based on selected brand
  const modelOptions = (filterData?.models && filter.brand)
    ? (filterData.models[filter.brand]?.map(model => ({ value: model, labelKey: model })) || [])
    : [];

  // Prepare generation options based on selected model
  const generationOptions = (filterData?.generations && filter.model)
    ? (filterData.generations[filter.model]?.map(gen => ({ value: gen, labelKey: gen })) || [])
    : [];

  return (
    <div className={styles.filterContainer}>
      <h2>
        {t("carFilter.titleLine1")} <br /> {t("carFilter.titleLine2")}
      </h2>

      <div className={styles.filterGrid}>
        {/* Brand dropdown */}
        <div className={styles.inputContainer}>
          <Dropdown
            options={brandOptions}
            value={filter.brand || ""}
            onChange={(val) => updateFilterField("brand", val)}
            placeholder={t("carFilter.brandPlaceholder")}
            disabled={isLoading}
          />
        </div>
        
        {/* Model dropdown */}
        <div className={styles.inputContainer}>
          <Dropdown
            options={modelOptions}
            value={filter.model || ""}
            onChange={(val) => updateFilterField("model", val)}
            placeholder={t("carFilter.modelPlaceholder")}
            disabled={isLoading || !filter.brand}
          />
        </div>
        
        {/* Generation dropdown */}
        <div className={styles.inputContainer}>
          <Dropdown
            options={generationOptions}
            value={filter.generation || ""}
            onChange={(val) => updateFilterField("generation", val)}
            placeholder={t("carFilter.generationPlaceholder")}
            disabled={isLoading || !filter.model}
          />
        </div>

        {/* Price range */}
        <div className={styles.intervalContainer}>
          <InputField
            type="number"
            value={filter.priceFrom ?? ""}
            onChange={handleInputEvent("priceFrom")}
            placeholder={t("carFilter.priceFromPlaceholder")}
          />
          <InputField
            type="number"
            value={filter.priceTo ?? ""}
            onChange={handleInputEvent("priceTo")}
            placeholder={t("carFilter.priceToPlaceholder")}
          />
        </div>

        {/* Year range */}
        <div className={styles.intervalContainer}>
          <InputField
            type="number"
            value={filter.yearFrom ?? ""}
            onChange={handleInputEvent("yearFrom")}
            placeholder={t("carFilter.yearFromPlaceholder")}
          />
          <InputField
            type="number"
            value={filter.yearTo ?? ""}
            onChange={handleInputEvent("yearTo")}
            placeholder={t("carFilter.yearToPlaceholder")}
          />
        </div>

        {/* Other fields... */}
        <Dropdown
          options={TRANSMISSION_OPTIONS}
          value={filter.transmission || ""}
          onChange={(val) => updateFilterField("transmission", val)}
          placeholder={t("carFilter.transmissionPlaceholder")}
        />
        
        <Dropdown
          options={BODY_OPTIONS}
          value={filter.bodyType || ""}
          onChange={(val) => updateFilterField("bodyType", val)}
          placeholder={t("carFilter.bodyTypePlaceholder")}
        />

        <Dropdown
          options={ENGINE_OPTIONS}
          value={filter.engineType || ""}
          onChange={(val) => updateFilterField("engineType", val)}
          placeholder={t("carFilter.engineTypePlaceholder")}
        />

        <div className={styles.intervalContainer}>
          <InputField
            type="number"
            value={filter.enginePowerFrom ?? ""}
            onChange={handleInputEvent("enginePowerFrom")}
            placeholder={t("carFilter.enginePowerFromPlaceholder")}
          />
          <InputField
            type="number"
            value={filter.enginePowerTo ?? ""}
            onChange={handleInputEvent("enginePowerTo")}
            placeholder={t("carFilter.enginePowerToPlaceholder")}
          />
        </div>

        <Dropdown
          options={DRIVE_OPTIONS}
          value={filter.drive || ""}
          onChange={(val) => updateFilterField("drive", val)}
          placeholder={t("carFilter.drivePlaceholder")}
        />

        <div className={styles.intervalContainer}>
          <InputField
            type="number"
            value={filter.engineCapacityFrom ?? ""}
            onChange={handleInputEvent("engineCapacityFrom")}
            placeholder={t("carFilter.engineCapacityFromPlaceholder")}
          />
          <InputField
            type="number"
            value={filter.engineCapacityTo ?? ""}
            onChange={handleInputEvent("engineCapacityTo")}
            placeholder={t("carFilter.engineCapacityToPlaceholder")}
          />
        </div>

        <Dropdown
          options={STEERING_OPTIONS}
          value={filter.steeringPosition || ""}
          onChange={(val) => updateFilterField("steeringPosition", val)}
          placeholder={t("carFilter.steeringPositionPlaceholder")}
        />

        <div className={styles.intervalContainer}>
          <InputField
            type="number"
            value={filter.mileageFrom ?? ""}
            onChange={handleInputEvent("mileageFrom")}
            placeholder={t("carFilter.mileageFromPlaceholder")}
          />
          <InputField
            type="number"
            value={filter.mileageTo ?? ""}
            onChange={handleInputEvent("mileageTo")}
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