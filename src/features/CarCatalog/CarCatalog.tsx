import React, { useState } from "react";
import styles from "./CarCatalog.module.scss";
import { CarFilterDto } from "@/shared/api/car/types";
import { useGetAllCars } from "@/shared/api/car/hooks";
import CarFilter from "@/widgets/FilterWidget/CarFilter";
import CarList from "@/widgets/CarList/CarList";
import { useTranslation } from "react-i18next";

const CarCatalog: React.FC = () => {
  const { t } = useTranslation();
  // State для фильтра, отображаемого в UI
  const [uiFilter, setUiFilter] = useState<CarFilterDto>({});
  
  // State для применяемого фильтра (для API запросов)
  const [appliedFilter, setAppliedFilter] = useState<CarFilterDto | undefined>(undefined);
  
  // State для отслеживания процесса поиска
  const [isSearching, setIsSearching] = useState(false);

  // Параметры пагинации и сортировки
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  // Использование хука для получения данных
  const { data, isLoading, isError, refetch } = useGetAllCars(
    appliedFilter, 
    page, 
    size, 
    sortBy, 
    sortOrder,
    "EU", // локаль
    {
      onSettled: () => {
        // Сбросить состояние поиска при завершении запроса (успешно или с ошибкой)
        setIsSearching(false);
      }
    }
  );

  const cars = data?.content || [];

  // Обработчик для применения текущего UI фильтра
  const handleApplyFilter = () => {
    setIsSearching(true);
    setAppliedFilter(uiFilter);
  };
  
  // Обработчик для очистки фильтров
  const handleClearFilters = () => {
    const emptyFilter: CarFilterDto = {};
    setUiFilter(emptyFilter);
    setIsSearching(true);
    setAppliedFilter(emptyFilter);
  };

  return (
    <div className={styles.container}>
      <CarFilter
        filter={uiFilter}
        onChange={(newFilter) => setUiFilter(newFilter)}
        onApplyFilter={handleApplyFilter}
        onClearFilters={handleClearFilters}
      />

      {(isLoading || isSearching) && (
        <div className={styles.loadingMessage}>
          {t("carFilter.searchingMessage") || "Ищем подходящие автомобили..."}
        </div>
      )}
      {isError && <div className={styles.errorMessage}>Ошибка при загрузке данных</div>}

      <CarList cars={cars} loading={(isLoading || isSearching)} />
      
      {/* Здесь можно добавить компонент пагинации */}
    </div>
  );
};

export default CarCatalog;