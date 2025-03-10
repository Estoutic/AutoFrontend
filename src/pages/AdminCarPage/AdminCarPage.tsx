import React, { useState } from "react";
import {
  CarFilterDto,
  CarCreationDto,
  CarResponseDto,
} from "@/shared/api/car/types";
import AdminFilterWidget from "@/widgets/AdminFilterWidget/AdminFilterWidget";
import AdminCarList from "@/widgets/AdminCarList/AdminCarList";
import { useAddCar, useDeleteCar, useGetAllCars } from "@/shared/api/car/hooks";
import styles from "./AdminCarPage.module.scss";
import CarFormModal from "@/entities/CarFormModal/CarFormModal";

const AdminCarPage: React.FC = () => {
  const [filter, setFilter] = useState<CarFilterDto>({});

  const { data, isLoading, isError } = useGetAllCars(filter);

  const deleteMutation = useDeleteCar();
  const createMutation = useAddCar();
  const cars = data?.content || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedCar, setSelectedCar] = useState<CarResponseDto | null>(null);

  const handleFilterChange = (newFilter: CarFilterDto) => {
    setFilter(newFilter);
    console.log("Обновлён фильтр:", newFilter);
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setSelectedCar(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (car: CarResponseDto) => {
    setModalMode("edit");
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteCar = (car: CarResponseDto) => {
    if (window.confirm("Удалить автомобиль?")) {
      deleteMutation.mutate(car.id);
      if (deleteMutation.isError) {
        alert(deleteMutation.error);
      }
      console.log("Удаление автомобиля:", car.id);
    }
  };

  const handleManageTranslations = (car: CarResponseDto) => {
    console.log("Управление переводами для автомобиля:", car.id);
  };

  const handleManagePhotos = (car: CarResponseDto) => {
    console.log("Управление фотографиями для автомобиля:", car.id);
  };

  const handleCreateCar = (data: CarCreationDto) => {
    console.log("Создаем автомобиль:", data);
    createMutation.mutate(data);
    if (deleteMutation.isError) {
      alert(deleteMutation.error);
    }
    setIsModalOpen(false);
  };

  const handleUpdateCar = (id: string, data: CarCreationDto) => {
    console.log("Обновляем автомобиль:", id, data);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <h2>Управление автомобилями</h2>
      <AdminFilterWidget filter={filter} onChange={handleFilterChange} />
      <button className={styles.addButton} onClick={handleOpenCreateModal}>
        Добавить автомобиль
      </button>

      {isLoading ? (
        <div>Загрузка...</div>
      ) : isError ? (
        <div>Ошибка загрузки автомобилей</div>
      ) : (
        <AdminCarList
          cars={cars}
          onEditCar={handleOpenEditModal}
          onDeleteCar={handleDeleteCar}
          onManageTranslations={handleManageTranslations}
          onManagePhotos={handleManagePhotos}
        />
      )}

      <CarFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        car={selectedCar || undefined}
        onClose={handleCloseModal}
        onCreateCar={handleCreateCar}
        onUpdateCar={handleUpdateCar}
      />
    </div>
  );
};

export default AdminCarPage;
