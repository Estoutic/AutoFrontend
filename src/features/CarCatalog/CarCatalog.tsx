import React, { useState, useEffect, useRef } from "react";
import styles from "./CarCatalog.module.scss";
import { CarFilterDto } from "@/shared/api/car/types";
import { useGetAllCars } from "@/shared/api/car/hooks";
import CarFilter from "@/widgets/FilterWidget/CarFilter";
import CarList from "@/widgets/CarList/CarList";
import Pagination from "@/shared/ui/Pagination/Pagination";
import { useTranslation } from "react-i18next";

const CarCatalog: React.FC = () => {
  const { t } = useTranslation();
  
  // Create a ref for scrolling to the car list
  const filterRef = useRef<HTMLDivElement>(null);
  
  // Ref для списка автомобилей
  const carListRef = useRef<HTMLDivElement>(null);
  
  
  // Filter state displayed in UI
  const [uiFilter, setUiFilter] = useState<CarFilterDto>({});
  
  // Applied filter state for API requests
  const [appliedFilter, setAppliedFilter] = useState<CarFilterDto | undefined>(undefined);
  
  // State for tracking search process
  const [isSearching, setIsSearching] = useState(false);

  // Pagination and sorting parameters
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  // Hook for getting data
  const { data, isLoading, isError, refetch } = useGetAllCars(
    appliedFilter, 
    page, 
    size, 
    sortBy, 
    sortOrder,
    "EU", // locale
    {
      onSettled: () => {
        // Reset search state when request completes (success or error)
        setIsSearching(false);
      }
    }
  );

  const cars = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;
  
  // Reset to first page when filter changes
  useEffect(() => {
    setPage(0);
  }, [appliedFilter]);

  // Handler for applying current UI filter
  const handleApplyFilter = () => {
    setIsSearching(true);
    setAppliedFilter(uiFilter);
    setPage(0); // Reset to first page when applying new filter
  };
  
  // Handler for clearing filters
  const handleClearFilters = () => {
    const emptyFilter: CarFilterDto = {};
    setUiFilter(emptyFilter);
    setIsSearching(true);
    setAppliedFilter(emptyFilter);
    setPage(0); // Reset to first page when clearing filter
  };
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    
    // Прокрутка к фильтрам после загрузки данных
    setTimeout(() => {
      if (filterRef.current) {
        filterRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }
    }, 100);
  };


  return (
    <div className={styles.container}>
          <div ref={filterRef}>
        <CarFilter
          filter={uiFilter}
          onChange={(newFilter) => setUiFilter(newFilter)}
          onApplyFilter={handleApplyFilter}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Display total count at the top if there are cars */}
      {/* {!isLoading && !isSearching && totalElements > 0 && (
        <div className={styles.resultsInfoTop}>
          {t('pagination.resultsInfo', {
            count: totalElements,
            defaultValue: `Найдено автомобилей: ${totalElements}`
          })}
        </div>
      )} */}

      {(isLoading || isSearching) && (
        <div className={styles.loadingMessage}>
          {t("carFilter.searchingMessage") || "Ищем подходящие автомобили..."}
        </div>
      )}
      
      {isError && <div className={styles.errorMessage}>Ошибка при загрузке данных</div>}

      <div ref={carListRef}>
        <CarList cars={cars} loading={(isLoading || isSearching)} carsCount={totalElements} />
      </div>
      
      {/* Pagination component */}
      {!isError && totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            disabled={isLoading || isSearching}
          />
          
          {/* Display current page info */}
          <div className={styles.pageInfo}>
            {t('pagination.pageInfo', {
              current: page + 1,
              total: totalPages,
              defaultValue: `Страница ${page + 1} из ${totalPages}`
            })}
          </div>
        </div>
      )}
      
      {/* No results message */}
      {!isLoading && !isSearching && cars.length === 0 && !isError && (
        <div className={styles.noResultsMessage}>
          {t('carFilter.noResults') || 'Автомобили не найдены. Попробуйте изменить параметры поиска.'}
        </div>
      )}
    </div>
  );
};

export default CarCatalog;