import React, { useState } from "react";
import {
  CarFilterDto,
  CarCreationDto,
  CarResponseDto,
} from "@/shared/api/car/types";
import AdminFilterWidget from "@/widgets/AdminFilterWidget/AdminFilterWidget";
import AdminCarList from "@/widgets/AdminCarList/AdminCarList";
import {
  useAddCar,
  useDeleteCar,
  useGetAllCars,
  useUpdateCar,
} from "@/shared/api/car/hooks";
import styles from "./AdminCarPage.module.scss";
import CarFormModal from "@/entities/CarFormModal/CarFormModal";
import CarImagesModal from "@/features/CarImagesModal/CarImagesModal";
import Button from "@/shared/ui/Button/Button";
import { useNotifications } from "@/shared/hooks/useNotifications";
import { useNavigate } from "react-router-dom";

const AdminCarPage: React.FC = () => {
  const { showSuccess, showError, showInfo, showWarning } = useNotifications();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<CarFilterDto>({});
  const { data, isLoading, isError, refetch } = useGetAllCars(filter);
  const deleteMutation = useDeleteCar();
  const createMutation = useAddCar();
  const updateMutation = useUpdateCar();

  const cars = data?.content || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedCar, setSelectedCar] = useState<CarResponseDto | null>(null);
  const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);

  const handleFilterChange = (newFilter: CarFilterDto) => {
    setFilter(newFilter);
    showInfo("Фильтры применены", "Фильтрация");
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
    deleteMutation.mutate(car.id, {
      onSuccess: () => {
        showSuccess(`Автомобиль   успешно удален`, "Удаление автомобиля");
        refetch();
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Неизвестная ошибка";
        showError(
          `Ошибка при удалении автомобиля: ${errorMessage}`,
          "Ошибка удаления",
        );
      },
    });
  };

  const confirmDeleteCar = (car: CarResponseDto) => {
    if (window.confirm(`Вы уверены, что хотите удалить автомобиль  ?`)) {
      handleDeleteCar(car);
    }
  };

  const handleManageTranslations = (car: CarResponseDto) => {
    navigate(`/admin/cars/translations/${car.id}`);
    showInfo(`Переход к управлению переводами для  `, "Управление переводами");
  };

  const handleManagePhotos = (car: CarResponseDto) => {
    setSelectedCar(car);
    setIsImagesModalOpen(true);
  };

  const handleCloseImagesModal = () => {
    setIsImagesModalOpen(false);
    refetch(); // Обновляем список после возможных изменений фотографий
  };

  const handleCreateCar = (data: CarCreationDto) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        showSuccess(
          `Автомобиль ${data.carModelDto?.brand} ${data.carModelDto?.model} успешно создан`,
          "Новый автомобиль",
        );
        refetch();
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Неизвестная ошибка";
        showError(
          `Ошибка при создании автомобиля: ${errorMessage}`,
          "Ошибка создания",
        );
      },
    });
  };

  const handleUpdateCar = (id: string, data: CarCreationDto) => {
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          showSuccess(`Автомобиль успешно обновлен`, "Обновление автомобиля");
          refetch();
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Неизвестная ошибка";
          showError(
            `Ошибка при обновлении автомобиля: ${errorMessage}`,
            "Ошибка обновления",
          );
        },
      },
    );
  };

  return (
    <div className={styles.container}>
      <h2>Управление автомобилями</h2>

      <div className={styles.actionsRow}>
        <AdminFilterWidget filter={filter} onChange={handleFilterChange} />
        <Button className={styles.addButton} onClick={handleOpenCreateModal}>
          Добавить автомобиль
        </Button>
      </div>

      {isLoading ? (
        <div className={styles.loadingState}>Загрузка автомобилей...</div>
      ) : isError ? (
        <div className={styles.errorState}>
          <p>Ошибка загрузки автомобилей</p>
          <Button onClick={() => refetch()}>Попробовать снова</Button>
        </div>
      ) : cars.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Автомобили не найдены</p>
          {Object.keys(filter).length > 0 ? (
            <p className={styles.filterHint}>
              Попробуйте изменить параметры фильтрации
            </p>
          ) : (
            <p>Добавьте автомобиль, нажав на кнопку "Добавить автомобиль"</p>
          )}
        </div>
      ) : (
        <AdminCarList
          cars={cars}
          onEditCar={handleOpenEditModal}
          onDeleteCar={confirmDeleteCar}
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

      {isImagesModalOpen && selectedCar && (
        <CarImagesModal car={selectedCar} onClose={handleCloseImagesModal} />
      )}
    </div>
  );
};

export default AdminCarPage;
