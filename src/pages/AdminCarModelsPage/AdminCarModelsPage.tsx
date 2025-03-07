// src/pages/AdminCarModelsPage/AdminCarModelsPage.tsx

import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { carModelApi } from "@/shared/api/client";  
import {
  useCreateModel,
  useDeleteModel,
  useUpdateModel,
  useGetAllFilters,  
} from "@/shared/api/carModel/hooks";
import { CarModelDto } from "@/shared/api/car/types";
import Dropdown from "@/shared/ui/Dropdown/Dropdown";
import styles from "./AdminCarModelsPage.module.scss";

interface CarModelRow {
  brand: string;
  model: string;
  generation: string;
//   id?: string;
}

export const AdminCarModelsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: filterData, isLoading: isFilterLoading } = useGetAllFilters();

  const [filterBrand, setFilterBrand] = useState<string>("");
  const [filterModel, setFilterModel] = useState<string>("");

  const [carModels, setCarModels] = useState<CarModelRow[]>([]);
  const [selectedModel, setSelectedModel] = useState<CarModelRow>();

  const [showForm, setShowForm] = useState<boolean>(false);
  const [newBrand, setNewBrand] = useState<string>("");
  const [newModel, setNewModel] = useState<string>("");
  const [newGeneration, setNewGeneration] = useState<string>("");

  const loadAllCarModels = () => {
    if (!filterData) return;
    const result: CarModelRow[] = [];
    filterData.brands.forEach((b) => {
      (filterData.models[b] || []).forEach((m) => {
        (filterData.generations[m] || [""]).forEach((g) => {
        //   const id = `${b}-${m}-${g}`.trim();
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
    const dto: CarModelDto = {
      brand: newBrand,
      model: newModel,
      generation: newGeneration,
    };
    createModel(dto, {
      onSuccess: () => {
        console.log("Модель успешно создана!");
        loadAllCarModels();
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

  const handleDeleteModel = () => {
    if (!selectedModel) {
      alert("Сначала выберите модель");
      return;
    }
   
    deleteModel(selectedModel, {
      onSuccess: () => {
        console.log("Модель удалена:", selectedModel);
        loadAllCarModels();
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
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          Добавить
        </button>
      </div>

      {/* Фильтры: используем данные из filterData */}
      <div className={styles.filterContainer}>
        <Dropdown
          options={
            filterData ? filterData.brands.map((b) => ({ value: b, labelKey: b })) : []
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
            <tr key={item.id || `${item.brand}-${item.model}-${idx}`}>
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
        <button className={styles.editButton} disabled={!selectedModel}>
          Изменить
        </button>
        <button className={styles.deleteButton} disabled={!selectedModel} onClick={handleDeleteModel}>
          Удалить
        </button>
      </div>

      {/* Форма добавления модели */}
      {showForm && (
        <div className={styles.formContainer}>
          <h3>Добавить модель</h3>
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
            <button onClick={handleCreateModel}>Создать</button>
            <button onClick={() => setShowForm(false)}>Отмена</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCarModelsPage;