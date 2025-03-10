import React from "react";
import { CarResponseDto } from "@/shared/api/car/types";
import styles from "./AdminCarList.module.scss";
import AdminCarCard from "@/entities/AdminCarCard/AdminCarCard";

interface AdminCarsListProps {
  cars: CarResponseDto[];
  onEditCar: (car: CarResponseDto) => void;
  onDeleteCar: (car: CarResponseDto) => void;
  onManageTranslations: (car: CarResponseDto) => void;
  onManagePhotos: (car: CarResponseDto) => void;
}

const AdminCarList: React.FC<AdminCarsListProps> = ({
  cars,
  onEditCar,
  onDeleteCar,
  onManageTranslations,
  onManagePhotos,
}) => {
    const filtredCars = cars.filter(function(car) {
        return car.isAvailable
      })
  return (
    <div className={styles.listContainer}>
      <div className={styles.cardList}>
        {filtredCars.map((car) => (
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
    </div>
  );
};

export default AdminCarList;