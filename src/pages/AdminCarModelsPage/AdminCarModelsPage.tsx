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
import Pagination from "@/shared/ui/Pagination/Pagination";
import styles from "./AdminCarModelsPage.module.scss";
import Button from "@/shared/ui/Button/Button";
import { useNotifications } from "@/shared/hooks/useNotifications";
import { useTranslation } from "react-i18next";

export const AdminCarModelsPage: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { showSuccess, showError, showWarning, showInfo } = useNotifications();

  const { data: filterData, isLoading: isFilterLoading } = useGetAllFilters();

  const [filterBrand, setFilterBrand] = useState<string>("");
  const [filterModel, setFilterModel] = useState<string>("");

  const [carModels, setCarModels] = useState<CarModelDto[]>([]);
  const [selectedModel, setSelectedModel] = useState<CarModelDto>();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
  
  // Validation errors
  const [errors, setErrors] = useState<{
    brand?: string;
    model?: string;
    generation?: string;
  }>({});

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

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [filterBrand, filterModel]);

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

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredModels.length / itemsPerPage);
  
  // Get current page data
  const currentModels = filteredModels.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const { mutate: createModel } = useCreateModel();
  const { mutate: deleteModel } = useDeleteModel();
  const { mutate: updateModel } = useUpdateModel();

  // Clear filters function
  const handleClearFilters = () => {
    setFilterBrand("");
    setFilterModel("");
    setCurrentPage(0); // Reset to first page
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Deselect the current model when changing pages
    setSelectedModel(undefined);
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors: { brand?: string; model?: string; generation?: string } = {};
    let isValid = true;

    if (!newBrand.trim()) {
      newErrors.brand = "Марка обязательна";
      isValid = false;
    }

    if (!newModel.trim()) {
      newErrors.model = "Модель обязательна";
      isValid = false;
    }

    if (!newGeneration.trim()) {
      newErrors.generation = "Поколение обязательно";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setNewBrand("");
    setNewModel("");
    setNewGeneration("");
    setErrors({});
    setShowForm(false);
  };

  const handleCreateModel = async () => {
    if (!validateForm()) {
      showWarning("Пожалуйста, заполните все обязательные поля");
      return;
    }

    const dto: CarModelDto = {
      brand: newBrand.trim(),
      model: newModel.trim(),
      generation: newGeneration.trim(),
    };

    try {
      showInfo("Создание модели...");
      await new Promise<void>((resolve, reject) => {
        createModel(dto, {
          onSuccess: () => resolve(),
          onError: (err) => reject(err),
        });
      });
      
      showSuccess("Модель успешно создана!");
      queryClient.invalidateQueries("allFilters");
      queryClient.refetchQueries("allFilters");
      resetForm();
    } catch (error) {
      showError(
        typeof error === "string"
          ? error
          : "Ошибка при создании модели"
      );
    }
  };

  const handleEditModel = async () => {
    if (!selectedModel) {
      showWarning("Сначала выберите модель");
      return;
    }

    if (isLoading) {
      showInfo("Загрузка данных...");
      return;
    }

    if (isError || !currentModel) {
      showError("Ошибка загрузки модели!");
      return;
    }

    // Check if at least one field is filled for update
    if (!newBrand.trim() && !newModel.trim() && !newGeneration.trim()) {
      showWarning("Измените хотя бы одно поле");
      return;
    }

    const dto: CarModelDto = {
      brand: newBrand.trim() !== "" ? newBrand.trim() : currentModel.brand,
      model: newModel.trim() !== "" ? newModel.trim() : currentModel.model,
      generation: newGeneration.trim() !== "" ? newGeneration.trim() : currentModel.generation,
    };

    if (!dto.brand || !dto.model || !dto.generation) {
      showWarning("Все поля должны быть заполнены");
      return;
    }

    if (currentModel.carModelId) {
      try {
        showInfo("Обновление модели...");
        await new Promise<void>((resolve, reject) => {
          updateModel(
            { id: currentModel.carModelId!, dto: dto },
            {
              onSuccess: () => resolve(),
              onError: (err) => reject(err),
            },
          );
        });
        
        showSuccess("Модель успешно обновлена!");
        queryClient.invalidateQueries("allFilters");
        queryClient.refetchQueries("allFilters");
        resetForm();
      } catch (error) {
        showError(
          typeof error === "string"
            ? error
            : "Ошибка при обновлении модели"
        );
      }
    } else {
      showError("Не удалось найти ID модели");
    }
  };

  const handleDeleteModel = async () => {
    if (!selectedModel) {
      showWarning("Сначала выберите модель");
      return;
    }

    if (window.confirm("Вы уверены, что хотите удалить эту модель?")) {
      try {
        showInfo("Удаление модели...");
        await new Promise<void>((resolve, reject) => {
          deleteModel(selectedModel, {
            onSuccess: () => resolve(),
            onError: (err) => reject(err),
          });
        });
        
        showSuccess("Модель успешно удалена");
        queryClient.invalidateQueries("allFilters");
        queryClient.refetchQueries("allFilters");
        setSelectedModel(undefined);
      } catch (error) {
        showError(
          typeof error === "string"
            ? error
            : "Ошибка при удалении модели"
        );
      }
    }
  };

  // Pre-fill form when editing
  useEffect(() => {
    if (!createForm && currentModel && showForm) {
      setNewBrand(currentModel.brand || "");
      setNewModel(currentModel.model || "");
      setNewGeneration(currentModel.generation || "");
    }
  }, [createForm, currentModel, showForm]);

  // Handle items per page change
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setItemsPerPage(newSize);
    setCurrentPage(0); // Reset to first page when changing items per page
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Список моделей автомобиля</h2>
      </div>

      <div className={styles.filterContainer}>
        <div className={styles.dropdowns}>
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
        </div>
        <div className={styles.filterButtons}>
          <Button
            variant="secondary"
            onClick={handleClearFilters}
            disabled={!filterBrand && !filterModel}
            className={styles.clearButton}
          >
            Очистить
          </Button>
          <Button
            className={styles.addButton}
            onClick={() => {
              resetForm();
              setShowForm(true);
              setCreateForm(true);
            }}
          >
            Добавить
          </Button>
        </div>
      </div>

      {/* Table models */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Марка</th>
              <th>Модель</th>
              <th>Поколение</th>
            </tr>
          </thead>
          <tbody>
            {currentModels.length > 0 ? (
              currentModels.map((item, idx) => (
                <tr 
                  key={`${item.brand}-${item.model}-${item.generation}-${idx}`}
                  className={selectedModel === item ? styles.selectedRow : ""}
                  onClick={() => setSelectedModel(item)}
                >
                  <td>
                    <div className={styles.brandContainer}>
                      {item.brand}
                      <label className={styles.customCheckbox}>
                        <input
                          type="checkbox"
                          checked={selectedModel === item}
                          onChange={() => setSelectedModel(item)}
                        />
                        <span className={styles.checkmark}></span>
                      </label>
                    </div>
                  </td>
                  <td>{item.model}</td>
                  <td>{item.generation}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className={styles.noData}>
                  {isFilterLoading 
                    ? "Загрузка данных..." 
                    : "Нет доступных моделей"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination controls */}
      <div className={styles.paginationControls}>
        <div className={styles.itemsPerPage}>
          <span>{t('pagination.itemsPerPage', { defaultValue: 'Показывать по:' })}</span>
          <select 
            value={itemsPerPage} 
            onChange={handleItemsPerPageChange}
            className={styles.itemsPerPageSelect}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
        
        {filteredModels.length > 0 && (
          <div className={styles.resultsInfo}>
            {t('admin.carModels.total', {
              count: filteredModels.length,
              defaultValue: `Всего: ${filteredModels.length}`
            })}
          </div>
        )}
      </div>
      
      <div className={styles.actionButtons}>
        <Button
          className={styles.editButton}
          disabled={!selectedModel}
          onClick={() => {
            if (selectedModel) {
              setShowForm(true);
              setCreateForm(false);
              setErrors({});
            } else {
              showWarning("Сначала выберите модель");
            }
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
              onChange={(e) => {
                setNewBrand(e.target.value);
                if (e.target.value.trim()) {
                  setErrors({ ...errors, brand: undefined });
                }
              }}
              className={errors.brand ? styles.inputError : ""}
            />
            {errors.brand && <span className={styles.errorMessage}>{errors.brand}</span>}
          </div>
          
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Модель"
              value={newModel}
              onChange={(e) => {
                setNewModel(e.target.value);
                if (e.target.value.trim()) {
                  setErrors({ ...errors, model: undefined });
                }
              }}
              className={errors.model ? styles.inputError : ""}
            />
            {errors.model && <span className={styles.errorMessage}>{errors.model}</span>}
          </div>
          
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Поколение"
              value={newGeneration}
              onChange={(e) => {
                setNewGeneration(e.target.value);
                if (e.target.value.trim()) {
                  setErrors({ ...errors, generation: undefined });
                }
              }}
              className={errors.generation ? styles.inputError : ""}
            />
            {errors.generation && <span className={styles.errorMessage}>{errors.generation}</span>}
          </div>
          
          <div className={styles.formActions}>
            {createForm ? (
              <Button onClick={handleCreateModel}>Создать</Button>
            ) : (
              <Button onClick={handleEditModel}>Обновить</Button>
            )}
            <Button variant="secondary" onClick={() => setShowForm(false)}>Отмена</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCarModelsPage;