import React, { useState } from "react";
import CarDetailCard from "@/entities/CarDetailCard/CarDetailCard";
import styles from "./CarList.module.scss";
import { CarResponseDto } from "@/shared/api/car/types";
import CarRequestModal from "@/features/CarRequestModal/CarRequestModal";
import { useTranslation } from "react-i18next";

interface CarListProps {
  cars: CarResponseDto[];
}

const CarList: React.FC<CarListProps> = ({ cars }) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarResponseDto | null>(null);

  const filtredCars = cars.filter((car) => car.isAvailable)
  const handleOpenModal = (car: CarResponseDto) => {
    setSelectedCar(car);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCar(null);
  };

  const handleSubmitForm = (data: any) => {
    console.log("Форма отправлена:", data);
  };
  console.log(cars);

  return (
    <div className={styles.listContainer}>
      <h2>{t("carList.foundCars", { count: filtredCars.length })}</h2>
      <div className={styles.cardList}>
        {filtredCars.map((car) => (
          <CarDetailCard key={car.id} car={car}  onSubmit={() => handleOpenModal(car)} />
        ))}
      </div>
      <CarRequestModal
        isOpen={showModal}
        car={selectedCar}
        onClose={handleCloseModal}
        onSubmit={handleSubmitForm}
      />
    </div>
  );
};

export default CarList;
