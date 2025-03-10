import React from "react";
import styles from "./AdminFilterWidget.module.scss";
import Dropdown from "@/shared/ui/Dropdown/Dropdown";
import Button from "@/shared/ui/Button/Button";
import { CarFilterDto } from "@/shared/api/car/types";
import { useTranslation } from "react-i18next";
import { useGetAllFilters } from "@/shared/api/carModel/hooks";

interface CarFilterProps {
  filter: CarFilterDto;
  onChange: (newFilter: CarFilterDto) => void;
}

const AdminFilterWidget: React.FC<CarFilterProps> = ({ filter, onChange }) => {
  const { t } = useTranslation();
  const { data: filterData, isLoading } = useGetAllFilters();

  const updateFilter = (field: keyof CarFilterDto, value: string) => {
    if (field === "brand") {
      onChange({ ...filter, brand: value, model: "", generation: "" });
    } else if (field === "model") {
      onChange({ ...filter, model: value, generation: "" });
    } else {
      onChange({ ...filter, generation: value });
    }
  };

  // Универсальный рендер Dropdown для нужного поля
  const renderDropdown = (
    field: "brand" | "model" | "generation",
    options: { value: string; labelKey: string }[],
    disabled: boolean,
    placeholder: string
  ) => {
    return (
      <div className={styles.inputContainer}>
        <Dropdown
          options={options}
          value={filter[field] || ""}
          onChange={(val) => updateFilter(field, val)}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    );
  };

  const brandOptions = filterData
    ? filterData.brands.map((brand) => ({ value: brand, labelKey: brand }))
    : [];
  const modelOptions =
    filterData && filter.brand
      ? filterData.models[filter.brand]?.map((model) => ({
          value: model,
          labelKey: model,
        })) || []
      : [];
  const generationOptions =
    filterData && filter.model
      ? filterData.generations[filter.model]?.map((gen) => ({
          value: gen,
          labelKey: gen,
        })) || []
      : [];

  return (
    <div className={styles.filterContainer}>
      <h2>
        {t("carFilter.titleLine1")} <br /> {t("carFilter.titleLine2")}
      </h2>
      <div className={styles.filterGrid}>
        {renderDropdown(
          "brand",
          brandOptions,
          isLoading,
          t("carFilter.brandPlaceholder", "Марка")
        )}
        {renderDropdown(
          "model",
          modelOptions,
          isLoading || !filter.brand,
          t("carFilter.modelPlaceholder", "Модель")
        )}
        {renderDropdown(
          "generation",
          generationOptions,
          isLoading || !filter.model,
          t("carFilter.generationPlaceholder", "Поколение")
        )}
        <Button onClick={() => console.log("Текущий фильтр:", filter)}>
          {t("carFilter.showButton", "Показать")}
        </Button>
      </div>
    </div>
  );
};

export default AdminFilterWidget;