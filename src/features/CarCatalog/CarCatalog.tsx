import React, { useState } from "react";
import styles from "./CarCatalog.module.scss";
import { CarFilterDto } from "@/shared/api/car/types";
import { useGetAllCars } from "@/shared/api/car/hooks";
import CarFilter from "@/widgets/FilterWidget/CarFilter";
import CarList from "@/widgets/CarList/CarList";

const CarCatalog: React.FC = () => {
  const [filter, setFilter] = useState<CarFilterDto>({});

  const { data, isLoading, isError } = useGetAllCars(filter);

  const cars = data?.content || [];

  return (
    <div className={styles.container}>
      <CarFilter
        filter={filter}
        onChange={(newFilter) => setFilter(newFilter)}
      />

      {isLoading && <div>Загрузка...</div>}
      {isError && <div>Ошибка при загрузке данных</div>}

      <CarList cars={cars} />
    </div>
  );
};

export default CarCatalog;
