import React, { useState, useEffect } from "react";
import { CarResponseDto } from "@/shared/api/car/types";
import Pagination from "@/shared/ui/Pagination/Pagination";
import styles from "./AdminCarList.module.scss";
import AdminCarCard from "@/entities/AdminCarCard/AdminCarCard";
import { useTranslation } from "react-i18next";

interface AdminCarsListProps {
  cars: CarResponseDto[];
  onEditCar: (car: CarResponseDto) => void;
  onDeleteCar: (car: CarResponseDto) => void;
  onManageTranslations: (car: CarResponseDto) => void;
  onManagePhotos: (car: CarResponseDto) => void;
  itemsPerPage?: number;
}

const AdminCarList: React.FC<AdminCarsListProps> = ({
  cars,
  onEditCar,
  onDeleteCar,
  onManageTranslations,
  onManagePhotos,
  itemsPerPage = 9 // Default to 9 items per page (3x3 grid)
}) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  
  // Filter available cars
  const filteredCars = cars.filter(car => car.isAvailable);
  
  // Calculate pagination values
  const totalItems = filteredCars.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Get current page items
  const currentCars = filteredCars.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  
  // Reset to first page when the car list changes
  useEffect(() => {
    setCurrentPage(0);
  }, [cars]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the list for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.listContainer}>
      <div className={styles.cardList}>
        {currentCars.map((car) => (
          <AdminCarCard
            key={car.id}
            car={car}
            onEdit={onEditCar}
            onDelete={onDeleteCar}
            onManageTranslations={onManageTranslations}
            onManagePhotos={onManagePhotos}
          />
        ))}
      </div>
      
      {/* Show pagination only if there are enough items
      {totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )} */}
      

      
      {/* No results message */}
      {filteredCars.length === 0 && (
        <div className={styles.noResultsMessage}>
          {t('admin.carList.noResults') || 'Нет доступных автомобилей.'}
        </div>
      )}
    </div>
  );
};

export default AdminCarList;