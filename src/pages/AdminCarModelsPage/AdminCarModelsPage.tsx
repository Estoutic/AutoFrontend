import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import {
  useCreateModel,
  useDeleteModel,
  useUpdateModel,
  useGetAllFilters,
  useGetCarModel,
} from "@/shared/api/carModel/hooks";
import { CarModelDto } from "@/shared/api/car/types";
import Dropdown from "@/shared/ui/Dropdown/Dropdown";
import styles from "./AdminCarModelsPage.module.scss";
import Button from "@/shared/ui/Button/Button";

export const AdminCarModelsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: filterData, isLoading: isFilterLoading } = useGetAllFilters();

  const [filterBrand, setFilterBrand] = useState<string>("");
  const [filterModel, setFilterModel] = useState<string>("");

  const [carModels, setCarModels] = useState<CarModelDto[]>([]);
  const [selectedModel, setSelectedModel] = useState<CarModelDto>();

  const {
    data: currentModel,
    isLoading,
    isError,
  } = useGetCarModel(selectedModel ? selectedModel : {});

  const [showForm, setShowForm] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState<boolean>(true);

  const [newBrand, setNewBrand] = useState<string>("");
  const [newModel, setNewModel] = useState<string>("");
  const [newGeneration, setNewGeneration] = useState<string>("");

  const loadAllCarModels = () => {
    if (!filterData) return;
    const result: CarModelDto[] = [];
    filterData.brands.forEach((b) => {
      (filterData.models[b] || []).forEach((m) => {
        (filterData.generations[m] || [""]).forEach((g) => {
          result.push({ brand: b, model: m, generation: g });
        });
      });
    });
    setCarModels(result);
  };

  useEffect(() => {
    if (filterData) {
      loadAllCarModels();
    }
  }, [filterData]);

  const filteredModels = carModels.filter((item) => {
    let match = true;
    if (filterBrand) {
      match = match && item.brand === filterBrand;
    }
    if (filterModel) {
      match = match && item.model === filterModel;
    }
    return match;
  });

  const { mutate: createModel } = useCreateModel();
  const { mutate: deleteModel } = useDeleteModel();
  const { mutate: updateModel } = useUpdateModel();

  const handleCreateModel = () => {
    if (!newBrand.trim() || !newModel.trim() || !newGeneration.trim()) {
      alert("Пожалуйста, заполните все поля");
      return;
    }
    const dto: CarModelDto = {
      brand: newBrand,
      model: newModel,
      generation: newGeneration,
    };
    createModel(dto, {
      onSuccess: () => {
        console.log("Модель успешно создана!");
        queryClient.invalidateQueries("allFilters");
        queryClient.refetchQueries("allFilters");
        setNewBrand("");
        setNewModel("");
        setNewGeneration("");
        setShowForm(false);
      },
      onError: (err) => {
        console.error("Ошибка при создании модели:", err);
      },
    });
  };

  const handleEditModel = () => {
    if (!selectedModel) {
      alert("Сначала выберите модель");
      return;
    }

    if (isLoading) {
      console.log("Загрузка данных...");
      return;
    }

    if (isError || !currentModel) {
      console.error("Ошибка загрузки модели!");
      return;
    }

    const dto: CarModelDto = {
      brand: newBrand != "" ? newBrand : currentModel.brand,
      model: newModel != "" ? newModel : currentModel.model,
      generation: newGeneration != "" ? newGeneration : currentModel.generation,
    };

    console.log("Текущая модель:", currentModel);
    if (currentModel.carModelId) {
      updateModel(
        { id: currentModel.carModelId, dto: dto },
        {
          onSuccess: () => {
            console.log("Модель успешно обновлена!");
            queryClient.invalidateQueries("allFilters");
            queryClient.refetchQueries("allFilters");
            setNewBrand("");
            setNewModel("");
            setNewGeneration("");
            setShowForm(false);
          },
          onError: (err) => {
            console.error("Ошибка при создании модели:", err);
          },
        },
      );
    }
  };

  const handleDeleteModel = () => {
    if (!selectedModel) {
      alert("Сначала выберите модель");
      return;
    }

    deleteModel(selectedModel, {
      onSuccess: () => {
        console.log("Модель удалена:", selectedModel);
        queryClient.invalidateQueries("allFilters");
        queryClient.refetchQueries("allFilters");
        setSelectedModel(undefined);
      },
      onError: (err) => {
        console.error("Ошибка при удалении модели:", err);
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Список моделей автомобиля</h2>
      
      </div>

      <div className={styles.filterContainer}>
        <Dropdown
          options={
            filterData
              ? filterData.brands.map((b) => ({ value: b, labelKey: b }))
              : []
          }
          value={filterBrand}
          onChange={(value) => {
            setFilterBrand(value);
            setFilterModel("");
          }}
          placeholder="Марка"
          disabled={isFilterLoading}
        />
        <Dropdown
          options={
            filterData && filterBrand
              ? (filterData.models[filterBrand] || []).map((m) => ({
                  value: m,
                  labelKey: m,
                }))
              : []
          }
          value={filterModel}
          onChange={(value) => setFilterModel(value)}
          placeholder="Модель"
          disabled={isFilterLoading || !filterBrand}
        />
          <Button
          className={styles.addButton}
          onClick={() => {
            setShowForm(true);
            setCreateForm(true);
          }}
        >
          Добавить
        </Button>
      </div>

      {/* Таблица моделей */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Марка</th>
            <th>Модель</th>
            <th>Поколение</th>
          </tr>
        </thead>
        <tbody>
          {filteredModels.map((item, idx) => (
            <tr key={`${item.brand} ${item.model} ${item.generation}`}>
              <td>
                <div className={styles.brandContainer}>
                  {item.brand}
                  <label className={styles.customCheckbox}>
                    <input
                      type="checkbox"
                      checked={selectedModel === item}
                      onChange={() => setSelectedModel(item!)}
                    />
                    <span className={styles.checkmark}></span>
                  </label>
                </div>
              </td>
              <td>{item.model}</td>
              <td>{item.generation}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.actionButtons}>
        <Button
          className={styles.editButton}
          disabled={!selectedModel}
          onClick={() => {
            setShowForm(true);
            setCreateForm(false);
          }}
        >
          Изменить
        </Button>
        <Button
          variant="secondary" 
          disabled={!selectedModel}
          onClick={handleDeleteModel}
        >
          Удалить
        </Button>
      </div>

      {showForm && (
        <div className={styles.formContainer}>
          {createForm ? <h3>Добавить модель</h3> : <h3>Обновить модель</h3>}
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Марка"
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Модель"
              value={newModel}
              onChange={(e) => setNewModel(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Поколение"
              value={newGeneration}
              onChange={(e) => setNewGeneration(e.target.value)}
            />
          </div>
          <div className={styles.formActions}>
            {createForm ? (
              <Button onClick={handleCreateModel}>Создать</Button>
            ) : (
              <Button onClick={handleEditModel}>Обновить</Button>
            )}
            <Button  variant="secondary" onClick={() => setShowForm(false)}>Отмена</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCarModelsPage;
