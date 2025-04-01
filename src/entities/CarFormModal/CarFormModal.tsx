import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  CarCreationDto,
  CarFilterDto,
  CarResponseDto,
} from "@/shared/api/car/types";
import Button from "@/shared/ui/Button/Button";
import Dropdown from "@/shared/ui/Dropdown/Dropdown";
import InputField from "@/shared/ui/InputField/InputField";
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

// Translations
const transmissionTypeTranslations = {
  [TransmissionType.AUTOMATIC]: "Автоматическая",
  [TransmissionType.MECHANICAL]: "Механическая",
  [TransmissionType.ROBOT]: "Робот",
  [TransmissionType.VARIATOR]: "Вариатор",
};

const bodyTypeTranslations = {
  [BodyType.SUV_3_DOORS]: "Внедорожник 3-дверный",
  [BodyType.SUV_5_DOORS]: "Внедорожник 5-дверный",
  [BodyType.SEDAN]: "Седан",
  [BodyType.COUPE]: "Купе",
  [BodyType.HATCHBACK_3_DOORS]: "Хэтчбек 3-дверный",
  [BodyType.HATCHBACK_5_DOORS]: "Хэтчбек 5-дверный",
  [BodyType.PICKUP_DOUBLE_CAB]: "Пикап с двойной кабиной",
  [BodyType.PICKUP_SINGLE_CAB]: "Пикап с одинарной кабиной",
  [BodyType.VAN]: "Фургон",
  [BodyType.MINIVAN]: "Минивэн",
};

const engineTypeTranslations = {
  [EngineType.GASOLINE]: "Бензин",
  [EngineType.DIESEL]: "Дизель",
  [EngineType.HYBRID]: "Гибрид",
  [EngineType.ELECTRIC]: "Электрический",
};

const driveTypeTranslations = {
  [DriveType.FWD]: "Передний привод",
  [DriveType.RWD]: "Задний привод",
  [DriveType.AWD]: "Полный привод",
};

const steeringPositionTranslations = {
  [SteeringPosition.LEFT]: "Левый руль",
  [SteeringPosition.RIGHT]: "Правый руль",
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
    control,
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
  const [customErrors, setCustomErrors] = useState<{ [key: string]: string }>(
    {},
  );

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

  const brandOptions =
    filterData?.brands.map((brand) => ({ value: brand, labelKey: brand })) ||
    [];

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

  // Options with translations
  const transmissionOptions = Object.values(TransmissionType).map((val) => ({
    value: val,
    labelKey: transmissionTypeTranslations[val] || val,
  }));

  const bodyTypeOptions = Object.values(BodyType).map((val) => ({
    value: val,
    labelKey: bodyTypeTranslations[val] || val,
  }));

  const engineTypeOptions = Object.values(EngineType).map((val) => ({
    value: val,
    labelKey: engineTypeTranslations[val] || val,
  }));

  const driveTypeOptions = Object.values(DriveType).map((val) => ({
    value: val,
    labelKey: driveTypeTranslations[val] || val,
  }));

  const steeringOptions = Object.values(SteeringPosition).map((val) => ({
    value: val,
    labelKey: steeringPositionTranslations[val] || val,
  }));

  useEffect(() => {
    if (isOpen) {
      setCustomErrors({});
      if (mode === "edit" && car) {
        // Set initial dropdown values when in edit mode
        // if (car.brand && car.model && car.generation) {
        //   setFilter({
        //     brand: car.brand,
        //     model: car.model,
        //     generation: car.generation,
        //   });
        // }
        
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
          vin: "",
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
        setCustomErrors((prev) => ({ ...prev, brand: "Марка обязательна" }));
        showWarning("Пожалуйста, выберите марку автомобиля");
        return false;
      }
      if (!filter.model?.trim()) {
        setCustomErrors((prev) => ({ ...prev, model: "Модель обязательна" }));
        showWarning("Пожалуйста, выберите модель автомобиля");
        return false;
      }
      if (!filter.generation?.trim()) {
        setCustomErrors((prev) => ({
          ...prev,
          generation: "Поколение обязательно",
        }));
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
        showSuccess(
          `Автомобиль ${filter.brand} ${filter.model} успешно создан`,
          "Новый автомобиль",
        );
      } else if (mode === "edit" && car?.id) {
        await onUpdateCar(car.id, data);
        showSuccess(`Автомобиль успешно обновлен`, "Редактирование");
      }

      onClose();
    } catch (error) {
      showError(
        typeof error === "string"
          ? error
          : "Произошла ошибка при сохранении автомобиля",
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

  const handleCancelClick = () => {
    if (
      isDirty &&
      window.confirm(
        "У вас есть несохраненные изменения. Вы уверены, что хотите закрыть форму?",
      )
    ) {
      onClose();
    } else if (!isDirty) {
      onClose();
    }
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
          <Button className={styles.closeButton} onClick={handleCancelClick}>
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
                    brandOptions,
                    false,
                    "Выберите марку",
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label>Модель*</label>
                  {renderDropdown(
                    "model",
                    modelOptions,
                    isLoading || !filter.brand,
                    "Выберите модель",
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label>Поколение*</label>
                  {renderDropdown(
                    "generation",
                    generationOptions,
                    isLoading || !filter.model,
                    "Выберите поколение",
                  )}
                </div>
              </>
            ) : (
              <></>
            )}

            <div className={styles.fieldGroup}>
              <label>Год*</label>
              <Controller
                control={control}
                name="year"
                rules={{
                  required: "Год обязателен",
                  min: {
                    value: 1900,
                    message: "Год должен быть не ранее 1900",
                  },
                  max: {
                    value: new Date().getFullYear() + 1,
                    message: `Год не может быть позже ${new Date().getFullYear() + 1}`,
                  },
                }}
                render={({ field, fieldState }) => (
                  <InputField
                    type="number"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Год выпуска"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Описание</label>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <InputField
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="Описание автомобиля"
                  />
                )}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Цвет*</label>
              <Controller
                control={control}
                name="color"
                rules={{ required: "Цвет обязателен" }}
                render={({ field, fieldState }) => (
                  <InputField
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="Цвет автомобиля"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Пробег (км)*</label>
              <Controller
                control={control}
                name="mileage"
                rules={{
                  required: "Пробег обязателен",
                  min: {
                    value: 0,
                    message: "Пробег не может быть отрицательным",
                  },
                  max: {
                    value: 1000000,
                    message: "Пробег не может превышать 1,000,000 км",
                  },
                }}
                render={({ field, fieldState }) => (
                  <InputField
                    type="number"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Пробег автомобиля"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Количество владельцев*</label>
              <Controller
                control={control}
                name="ownersCount"
                rules={{
                  required: "Количество владельцев обязательно",
                  min: {
                    value: 0,
                    message: "Количество владельцев не может быть отрицательным",
                  },
                  max: {
                    value: 20,
                    message: "Количество владельцев не может превышать 20",
                  },
                }}
                render={({ field, fieldState }) => (
                  <InputField
                    type="number"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Количество владельцев"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Коробка передач*</label>
              <Dropdown
                options={[
                  { value: "", labelKey: "Выберите коробку передач" },
                  ...transmissionOptions,
                ]}
                value={watchDropdownValue("transmissionType")}
                onChange={(val) =>
                  handleDropdownChange("transmissionType", val)
                }
                error={customErrors.transmissionType}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Тип кузова*</label>
              <Dropdown
                options={[
                  { value: "", labelKey: "Выберите тип кузова" },
                  ...bodyTypeOptions,
                ]}
                value={watchDropdownValue("bodyType")}
                onChange={(val) => handleDropdownChange("bodyType", val)}
                error={customErrors.bodyType}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Мощность (л.с.)*</label>
              <Controller
                control={control}
                name="enginePower"
                rules={{
                  required: "Мощность двигателя обязательна",
                  pattern: {
                    value: /^\d+$/,
                    message: "Мощность должна быть числом",
                  },
                }}
                render={({ field, fieldState }) => (
                  <InputField
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="Мощность двигателя"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Тип двигателя*</label>
              <Dropdown
                options={[
                  { value: "", labelKey: "Выберите тип двигателя" },
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
                  { value: "", labelKey: "Выберите тип привода" },
                  ...driveTypeOptions,
                ]}
                value={watchDropdownValue("driveType")}
                onChange={(val) => handleDropdownChange("driveType", val)}
                error={customErrors.driveType}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Объём двигателя (л)*</label>
              <Controller
                control={control}
                name="engineCapacity"
                rules={{
                  required: "Объем двигателя обязателен",
                  validate: (value) => {
                    const num = parseFloat(value || "");
                    if (isNaN(num)) return "Объем двигателя должен быть числом";
                    if (num < 0.1 || num > 10.0)
                      return "Объем двигателя должен быть между 0.1 и 10.0 л";
                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <InputField
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="Объём двигателя"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Расположение руля*</label>
              <Dropdown
                options={[
                  { value: "", labelKey: "Выберите расположение руля" },
                  ...steeringOptions,
                ]}
                value={watchDropdownValue("steeringPosition")}
                onChange={(val) =>
                  handleDropdownChange("steeringPosition", val)
                }
                error={customErrors.steeringPosition}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Количество мест*</label>
              <Controller
                control={control}
                name="seatsCount"
                rules={{
                  required: "Количество мест обязательно",
                  min: { value: 1, message: "Минимум 1 место" },
                  max: { value: 12, message: "Максимум 12 мест" },
                }}
                render={({ field, fieldState }) => (
                  <InputField
                    type="number"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Количество мест"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Цена*</label>
              <Controller
                control={control}
                name="price"
                rules={{
                  required: "Цена обязательна",
                  min: { value: 1, message: "Цена должна быть положительной" },
                }}
                render={({ field, fieldState }) => (
                  <InputField
                    type="number"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Цена автомобиля"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>VIN*</label>
              <Controller
                control={control}
                name="vin"
                rules={{
                  required: "VIN обязателен",
                  pattern: {
                    value: /^[A-HJ-NPR-Z0-9]{17}$/,
                    message:
                      "VIN должен содержать 17 символов (буквы и цифры, кроме I, O, Q)",
                  },
                }}
                render={({ field, fieldState }) => (
                  <InputField
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="VIN номер"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            <div className={styles.formActions}>
              <Button
                type="submit"
                disabled={!isDirty}
                className={styles.submitButton}
              >
                {mode === "create"
                  ? "Создать автомобиль"
                  : "Сохранить изменения"}
              </Button>
              <Button
                type="button"
                onClick={handleCancelClick}
                variant="secondary"
                className={styles.cancelButton}
              >
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