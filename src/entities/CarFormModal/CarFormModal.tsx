import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  CarCreationDto,
  CarFilterDto,
  CarResponseDto,
} from "@/shared/api/car/types";
import Button from "@/shared/ui/Button/Button";
import Dropdown from "@/shared/ui/Dropdown/Dropdown";
import styles from "./CarFormModal.module.scss";
import { TransmissionType } from "@/shared/constants/enums/TransmissionType";
import { BodyType } from "@/shared/constants/enums/BodyType";
import { EngineType } from "@/shared/constants/enums/EngineType";
import { SteeringPosition } from "@/shared/constants/enums/SteeringPosition";
import { DriveType } from "@/shared/constants/enums/ DriveType";
import { useGetAllFilters } from "@/shared/api/carModel/hooks";
import { useNotifications } from "@/shared/hooks/useNotifications";

interface CarFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  car?: CarResponseDto;
  onClose: () => void;
  onCreateCar: (data: CarCreationDto) => void;
  onUpdateCar: (id: string, data: CarCreationDto) => void;
}

// Custom validation rules
const validateRequired = (value: any) => value ? true : "Поле обязательно";
const validateYear = (value: number | undefined) => {
  if (!value) return "Год обязателен";
  const currentYear = new Date().getFullYear();
  if (value < 1900) return "Год должен быть не ранее 1900";
  if (value > currentYear + 1) return `Год не может быть позже ${currentYear + 1}`;
  return true;
};
const validatePositiveNumber = (value: number | undefined) => {
  if (!value && value !== 0) return "Поле обязательно";
  if (value < 0) return "Значение не может быть отрицательным";
  return true;
};
const validateMileage = (value: number | undefined) => {
  if (!value && value !== 0) return "Пробег обязателен";
  if (value < 0) return "Пробег не может быть отрицательным";
  if (value > 1000000) return "Пробег не может превышать 1,000,000 км";
  return true;
};
const validateOwners = (value: number | undefined) => {
  if (!value && value !== 0) return "Количество владельцев обязательно";
  if (value < 0) return "Количество владельцев не может быть отрицательным";
  if (value > 20) return "Количество владельцев не может превышать 20";
  return true;
};
const validateEnginePower = (value: string | undefined) => {
  if (!value) return "Мощность двигателя обязательна";
  if (!/^\d+$/.test(value)) return "Мощность должна быть числом";
  return true;
};
const validateEngineCapacity = (value: string | undefined) => {
  if (!value) return "Объем двигателя обязателен";
  const num = parseFloat(value);
  if (isNaN(num)) return "Объем двигателя должен быть числом";
  if (num < 0.1 || num > 10.0) return "Объем двигателя должен быть между 0.1 и 10.0 л";
  return true;
};
const validateSeats = (value: number | undefined) => {
  if (!value) return "Количество мест обязательно";
  if (value < 1) return "Минимум 1 место";
  if (value > 12) return "Максимум 12 мест";
  return true;
};
const validatePrice = (value: number | undefined) => {
  if (!value) return "Цена обязательна";
  if (value <= 0) return "Цена должна быть положительной";
  return true;
};
const validateVin = (value: string | undefined) => {
  if (!value) return "VIN обязателен";
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(value)) {
    return "VIN должен содержать 17 символов (буквы и цифры, кроме I, O, Q)";
  }
  return true;
};

const CarFormModal: React.FC<CarFormModalProps> = ({
  isOpen,
  mode,
  car,
  onClose,
  onCreateCar,
  onUpdateCar,
}) => {
  // Get notification functions
  const { showSuccess, showError, showWarning } = useNotifications();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    formState: { errors, isDirty },
  } = useForm<CarCreationDto>({
    mode: "onChange", // Validate on change for immediate feedback
  });

  const [filter, setFilter] = useState<CarFilterDto>({});
  const { data: filterData, isLoading } = useGetAllFilters();
  const [customErrors, setCustomErrors] = useState<{ [key: string]: string }>({});

  const updateFilter = (field: keyof CarFilterDto, value: string) => {
    if (field === "brand") {
      setFilter({
        ...filter,
        brand: value,
        model: "",
        generation: "",
      });
      setCustomErrors({
        ...customErrors,
        brand: value ? "" : "Марка обязательна",
      });
    } else if (field === "model") {
      setFilter({ ...filter, model: value, generation: "" });
      setCustomErrors({
        ...customErrors,
        model: value ? "" : "Модель обязательна",
      });
    } else {
      setFilter({ ...filter, generation: value });
      setCustomErrors({
        ...customErrors,
        generation: value ? "" : "Поколение обязательно",
      });
    }
  };

  const renderDropdown = (
    field: "brand" | "model" | "generation",
    options: { value: string; labelKey: string }[],
    disabled: boolean,
    placeholder: string,
  ) => {
    return (
      <div className={styles.inputContainer}>
        <Dropdown
          options={options}
          value={filter[field] || ""}
          onChange={(val) => updateFilter(field, val)}
          placeholder={placeholder}
          disabled={disabled}
          error={customErrors[field]}
        />
      </div>
    );
  };

  const brandOptions = filter
    ? filterData?.brands.map((brand) => ({ value: brand, labelKey: brand }))
    : [];
  const modelOptions =
    filterData && filter.brand
      ? filterData.models[filter.brand]?.map((model) => ({
          value: model,
          labelKey: model,
        })) || []
      : [];
  const generationOptions =
    filterData && filter.model
      ? filterData.generations[filter.model]?.map((gen) => ({
          value: gen,
          labelKey: gen,
        })) || []
      : [];

  const transmissionOptions = Object.values(TransmissionType).map((val) => ({
    value: val,
    labelKey: val,
  }));
  const bodyTypeOptions = Object.values(BodyType).map((val) => ({
    value: val,
    labelKey: val,
  }));
  const engineTypeOptions = Object.values(EngineType).map((val) => ({
    value: val,
    labelKey: val,
  }));
  const driveTypeOptions = Object.values(DriveType).map((val) => ({
    value: val,
    labelKey: val,
  }));
  const steeringOptions = Object.values(SteeringPosition).map((val) => ({
    value: val,
    labelKey: val,
  }));

  useEffect(() => {
    if (isOpen) {
      setCustomErrors({});
      if (mode === "edit" && car) {
        reset({
          year: car.year,
          description: car.description || "",
          color: car.color || "",
          mileage: car.mileage,
          ownersCount: car.ownersCount,
          transmissionType: car.transmissionType as TransmissionType,
          bodyType: car.bodyType as BodyType,
          enginePower: car.enginePower || "",
          engineType: car.engineType as EngineType,
          driveType: car.driveType as DriveType,
          engineCapacity: car.engineCapacity || "",
          steeringPosition: car.steeringPosition as SteeringPosition,
          seatsCount: car.seatsCount,
          price: car.price,
        });
      } else {
        reset({
          carModelDto: { brand: "", model: "", generation: "" },
          year: undefined,
          description: "",
          color: "",
          mileage: undefined,
          ownersCount: undefined,
          transmissionType: undefined,
          bodyType: undefined,
          enginePower: "",
          engineType: undefined,
          driveType: undefined,
          engineCapacity: "",
          steeringPosition: undefined,
          seatsCount: undefined,
          price: undefined,
          vin: "",
        });
        setFilter({});
      }
    }
  }, [isOpen, mode, car, reset]);

  const validateCarModel = () => {
    const errors = {};
    
    if (mode === "create") {
      if (!filter.brand?.trim()) {
        setCustomErrors(prev => ({ ...prev, brand: "Марка обязательна" }));
        showWarning("Пожалуйста, выберите марку автомобиля");
        return false;
      }
      if (!filter.model?.trim()) {
        setCustomErrors(prev => ({ ...prev, model: "Модель обязательна" }));
        showWarning("Пожалуйста, выберите модель автомобиля");
        return false;
      }
      if (!filter.generation?.trim()) {
        setCustomErrors(prev => ({ ...prev, generation: "Поколение обязательно" }));
        showWarning("Пожалуйста, выберите поколение автомобиля");
        return false;
      }
    }
    
    return true;
  };

  const validateDropdowns = (data: CarCreationDto) => {
    let valid = true;
    const newErrors = { ...customErrors };
    
    if (!data.transmissionType) {
      newErrors.transmissionType = "Коробка передач обязательна";
      valid = false;
    }
    
    if (!data.bodyType) {
      newErrors.bodyType = "Тип кузова обязателен";
      valid = false;
    }
    
    if (!data.engineType) {
      newErrors.engineType = "Тип двигателя обязателен";
      valid = false;
    }
    
    if (!data.driveType) {
      newErrors.driveType = "Тип привода обязателен";
      valid = false;
    }
    
    if (!data.steeringPosition) {
      newErrors.steeringPosition = "Расположение руля обязательно";
      valid = false;
    }
    
    setCustomErrors(newErrors);
    return valid;
  };

  const onSubmit: SubmitHandler<CarCreationDto> = async (data) => {
    try {
      // First check dropdown fields that are not easily validated with register
      if (!validateCarModel() || !validateDropdowns(data)) {
        return;
      }

      if (mode === "create") {
        data.carModelDto = {
          brand: filter.brand,
          model: filter.model,
          generation: filter.generation,
        };
        
        await onCreateCar(data);
        showSuccess("Автомобиль успешно создан");
      } else if (mode === "edit" && car?.id) {
        await onUpdateCar(car.id, data);
        showSuccess("Автомобиль успешно обновлен");
      }
      
      onClose();
    } catch (error) {
      showError(
        typeof error === "string" 
          ? error 
          : "Произошла ошибка при сохранении автомобиля"
      );
    }
  };

  const watchDropdownValue = (fieldName: keyof CarCreationDto): string => {
    const val = watch(fieldName);
    return (val as string) || "";
  };

  const handleDropdownChange = (field: string, value: string) => {
    setValue(field as any, value, { shouldValidate: true });
    setCustomErrors({
      ...customErrors,
      [field]: value ? "" : `${field} обязателен`,
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>
            {mode === "create"
              ? "Создать автомобиль"
              : "Редактировать автомобиль"}
          </h3>
          <Button className={styles.closeButton} onClick={onClose}>
            &times;
          </Button>
        </div>

        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {mode === "create" ? (
              <>
                <div className={styles.fieldGroup}>
                  <label>Марка*</label>
                  {renderDropdown(
                    "brand",
                    brandOptions ? brandOptions : [],
                    false,
                    "Марка"
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label>Модель*</label>
                  {renderDropdown(
                    "model",
                    modelOptions,
                    isLoading || !filter.brand,
                    "Модель"
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label>Поколение*</label>
                  {renderDropdown(
                    "generation",
                    generationOptions,
                    isLoading || !filter.model,
                    "Поколение"
                  )}
                </div>
              </>
            ) : (
              <></>
            )}

            <div className={styles.fieldGroup}>
              <label>Год*</label>
              <input 
                type="number" 
                placeholder="Год" 
                className={errors.year ? styles.inputError : ""}
                {...register("year", {
                  required: "Год обязателен",
                  min: { value: 1900, message: "Год должен быть не ранее 1900" },
                  max: { 
                    value: new Date().getFullYear() + 1, 
                    message: `Год не может быть позже ${new Date().getFullYear() + 1}` 
                  }
                })}
              />
              {errors.year && <span className={styles.error}>{errors.year.message}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label>Описание</label>
              <input
                type="text"
                placeholder="Описание"
                {...register("description")}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Цвет*</label>
              <input 
                type="text" 
                placeholder="Цвет" 
                className={errors.color ? styles.inputError : ""}
                {...register("color", {
                  required: "Цвет обязателен"
                })}
              />
              {errors.color && <span className={styles.error}>{errors.color.message}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label>Пробег (км)*</label>
              <input
                type="number"
                placeholder="Пробег"
                className={errors.mileage ? styles.inputError : ""}
                {...register("mileage", {
                  required: "Пробег обязателен",
                  min: { value: 0, message: "Пробег не может быть отрицательным" },
                  max: { value: 1000000, message: "Пробег не может превышать 1,000,000 км" }
                })}
              />
              {errors.mileage && <span className={styles.error}>{errors.mileage.message}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label>Владельцев*</label>
              <input
                type="number"
                placeholder="Владельцев"
                className={errors.ownersCount ? styles.inputError : ""}
                {...register("ownersCount", {
                  required: "Количество владельцев обязательно",
                  min: { value: 0, message: "Количество владельцев не может быть отрицательным" },
                  max: { value: 20, message: "Количество владельцев не может превышать 20" }
                })}
              />
              {errors.ownersCount && <span className={styles.error}>{errors.ownersCount.message}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label>Коробка передач*</label>
              <Dropdown
                options={[
                  { value: "", labelKey: "Не выбрано" },
                  ...transmissionOptions,
                ]}
                value={watchDropdownValue("transmissionType")}
                onChange={(val) => handleDropdownChange("transmissionType", val)}
                error={customErrors.transmissionType}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Тип кузова*</label>
              <Dropdown
                options={[
                  { value: "", labelKey: "Не выбрано" },
                  ...bodyTypeOptions,
                ]}
                value={watchDropdownValue("bodyType")}
                onChange={(val) => handleDropdownChange("bodyType", val)}
                error={customErrors.bodyType}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Мощность (л.с.)*</label>
              <input
                type="text"
                placeholder="Мощность"
                className={errors.enginePower ? styles.inputError : ""}
                {...register("enginePower", {
                  required: "Мощность двигателя обязательна",
                  pattern: {
                    value: /^\d+$/,
                    message: "Мощность должна быть числом"
                  }
                })}
              />
              {errors.enginePower && <span className={styles.error}>{errors.enginePower.message}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label>Тип двигателя*</label>
              <Dropdown
                options={[
                  { value: "", labelKey: "Не выбрано" },
                  ...engineTypeOptions,
                ]}
                value={watchDropdownValue("engineType")}
                onChange={(val) => handleDropdownChange("engineType", val)}
                error={customErrors.engineType}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Тип привода*</label>
              <Dropdown
                options={[
                  { value: "", labelKey: "Не выбрано" },
                  ...driveTypeOptions,
                ]}
                value={watchDropdownValue("driveType")}
                onChange={(val) => handleDropdownChange("driveType", val)}
                error={customErrors.driveType}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Объём двигателя (л)*</label>
              <input
                type="text"
                placeholder="Объём"
                className={errors.engineCapacity ? styles.inputError : ""}
                {...register("engineCapacity", {
                  required: "Объем двигателя обязателен",
                  validate: value => {
                    const num = parseFloat(value || "");
                    if (isNaN(num)) return "Объем двигателя должен быть числом";
                    if (num < 0.1 || num > 10.0) return "Объем двигателя должен быть между 0.1 и 10.0 л";
                    return true;
                  }
                })}
              />
              {errors.engineCapacity && (
                <span className={styles.error}>{errors.engineCapacity.message}</span>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label>Расположение руля*</label>
              <Dropdown
                options={[
                  { value: "", labelKey: "Не выбрано" },
                  ...steeringOptions,
                ]}
                value={watchDropdownValue("steeringPosition")}
                onChange={(val) => handleDropdownChange("steeringPosition", val)}
                error={customErrors.steeringPosition}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Количество мест*</label>
              <input
                type="number"
                placeholder="Мест"
                className={errors.seatsCount ? styles.inputError : ""}
                {...register("seatsCount", {
                  required: "Количество мест обязательно",
                  min: { value: 1, message: "Минимум 1 место" },
                  max: { value: 12, message: "Максимум 12 мест" }
                })}
              />
              {errors.seatsCount && <span className={styles.error}>{errors.seatsCount.message}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label>Цена*</label>
              <input 
                type="number" 
                placeholder="Цена" 
                className={errors.price ? styles.inputError : ""}
                {...register("price", {
                  required: "Цена обязательна",
                  min: { value: 1, message: "Цена должна быть положительной" }
                })}
              />
              {errors.price && <span className={styles.error}>{errors.price.message}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label>VIN*</label>
              <input 
                type="text" 
                placeholder="VIN" 
                className={errors.vin ? styles.inputError : ""}
                {...register("vin", {
                  required: "VIN обязателен",
                  pattern: {
                    value: /^[A-HJ-NPR-Z0-9]{17}$/,
                    message: "VIN должен содержать 17 символов (буквы и цифры, кроме I, O, Q)"
                  }
                })}
              />
              {errors.vin && <span className={styles.error}>{errors.vin.message}</span>}
            </div>

            <div className={styles.formActions}>
              <Button type="submit" disabled={!isDirty}>
                {mode === "create" ? "Создать" : "Сохранить"}
              </Button>
              <Button type="button" onClick={onClose} variant="secondary">
                Отмена
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarFormModal;