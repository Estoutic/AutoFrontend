// src/pages/AdminCarModelsPage/AdminCarModelsPage.tsx

import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { carModelApi } from "@/shared/api/client";  
import {
  useCreateModel,
  useDeleteModel,
  useGetBrands,
  useGetModels,
  useUpdateModel,
} from "@/shared/api/carModel/hooks";
import { CarModelDto } from "@/shared/api/car/types";
import Dropdown from "@/shared/ui/Dropdown/Dropdown";
import styles from "./AdminCarModelsPage.module.scss";

interface CarModelRow {
  brand: string;
  model: string;
}

export const AdminCarModelsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: brandsData } = useGetBrands();

  const [filterBrand, setFilterBrand] = useState<string>("");
  const [filterModel, setFilterModel] = useState<string>("");

  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);

  const { data: modelsData } = useGetModels(filterBrand);
  const { mutate: deleteModel } = useDeleteModel();
  const { mutate: updateModel } = useUpdateModel();

  const [carModels, setCarModels] = useState<CarModelRow[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedModelId, setSelectedModelId] = useState<string>("");

  const [formBrand, setFormBrand] = useState<string>("");
  const [formModel, setFormModel] = useState<string>("");

  const loadAllCarModels = async () => {
    try {
      if (!brandsData) return;
      const result: CarModelRow[] = [];
      for (const b of brandsData) {
        const modelsRes = await queryClient.fetchQuery(
          ["carModel", "list", { brand: b }],
          () => carModelApi.getModels(b),
        );
        const modelsArr = (modelsRes as string[]) || [];
        modelsArr.forEach((m) => {
          result.push({ brand: b, model: m });
        });
      }
      setCarModels(result);
    } catch (err) {
      console.error("Ошибка при загрузке списка моделей:", err);
    }
  };

  useEffect(() => {
    if (brandsData) {
      loadAllCarModels();
    }
  }, [brandsData]);

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

  const handleSubmitForm = () => {
    const dto: CarModelDto = {
      brand: formBrand,
      model: formModel,
    };
    if (formMode === "add") {
      createModel(dto, {
        onSuccess: () => {
          console.log("Модель успешно создана!");
          loadAllCarModels();
          resetForm();
        },
        onError: (err) => {
          console.error("Ошибка при создании модели:", err);
        },
      });
    } else if (formMode === "edit") {
      updateModel(
        { id: selectedModelId, dto },
        {
          onSuccess: () => {
            console.log("Модель успешно обновлена!");
            loadAllCarModels();
            resetForm();
          },
          onError: (err) => {
            console.error("Ошибка при обновлении модели:", err);
          },
        },
      );
    }
  };

  const resetForm = () => {
    setFormBrand("");
    setFormModel("");
    setFormMode(null);
    setSelectedModelId("");
  };

  const handleEditModel = () => {
    if (!selectedModelId) {
      alert("Сначала выберите модель");
      return;
    }
    const modelToEdit = carModels.find(
      (item) => `${item.brand} ${item.model}` === selectedModelId,
    );
    if (modelToEdit) {
      setFormBrand(modelToEdit.brand);
      setFormModel(modelToEdit.model);
      setFormMode("edit");
    }
  };

  const handleDeleteModel = () => {
    if (!selectedModelId) {
      alert("Сначала выберите модель");
      return;
    }

    deleteModel(selectedModelId, {
      onSuccess: () => {
        console.log("Модель удалена:", selectedModelId);
        loadAllCarModels();
        setSelectedModelId("");
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
        <button
          className={styles.addButton}
          onClick={() => {
            resetForm();
            setFormMode("add");
          }}
        >
          Добавить
        </button>
      </div>

      <div className={styles.filterContainer}>
        <Dropdown
          options={brandsData?.map((b) => ({ value: b, labelKey: b })) || []}
          value={filterBrand}
          onChange={(value) => {
            setFilterBrand(value);
            setFilterModel("");
          }}
          placeholder="Марка"
        />
        <Dropdown
          options={modelsData?.map((m) => ({ value: m, labelKey: m })) || []}
          value={filterModel}
          onChange={(value) => setFilterModel(value)}
          placeholder="Модель"
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Марка</th>
            <th>Модель</th>
          </tr>
        </thead>
        <tbody>
          {filteredModels.map((item, idx) => (
            <tr key={`${item.brand}-${item.model}-${idx}`}>
              <td>
                <div className={styles.brandContainer}>
                  {item.brand}
                  <label className={styles.customCheckbox}>
                    <input
                      type="checkbox"
                      checked={
                        selectedModelId === `${item.brand} ${item.model}`
                      }
                      onChange={() =>
                        setSelectedModelId(`${item.brand} ${item.model}`)
                      }
                    />
                    <span className={styles.checkmark}></span>
                  </label>
                </div>
              </td>
              <td>{item.model}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.actionButtons}>
        <button
          className={styles.editButton}
          disabled={!selectedModelId}
          onClick={handleEditModel}
        >
          Изменить
        </button>
        <button
          className={styles.deleteButton}
          disabled={!selectedModelId}
          onClick={handleDeleteModel}
        >
          Удалить
        </button>
      </div>

      {showForm && (
        <div className={styles.formContainer}>
          <h3>Добавить модель</h3>
          <div className={styles.formGroup}>
            <input
              type="text"
              value={formBrand}
              onChange={(e) => setFormBrand(e.target.value)}
              placeholder="Марка"
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="text"
              value={formModel}
              onChange={(e) => setFormModel(e.target.value)}
              placeholder="Модель"
            />
          </div>
          <div className={styles.formActions}>
            <button onClick={handleSubmitForm}>
              {formMode === "add" ? "Создать" : "Сохранить"}
            </button>
            <button onClick={() => setShowForm(false)}>Отмена</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCarModelsPage;