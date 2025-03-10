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

interface CarFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  car?: CarResponseDto;
  onClose: () => void;
  onCreateCar: (data: CarCreationDto) => void;
  onUpdateCar: (id: string, data: CarCreationDto) => void;
}

const CarFormModal: React.FC<CarFormModalProps> = ({
  isOpen,
  mode,
  car,
  onClose,
  onCreateCar,
  onUpdateCar,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CarCreationDto>();

  const [filter, setFilter] = useState<CarFilterDto>({});
  const { data: filterData, isLoading } = useGetAllFilters();

  const updateFilter = (field: keyof CarFilterDto, value: string) => {
    if (field === "brand") {
      setFilter({
        ...filter,
        brand: value,
        model: "",
        generation: "",
      });
    } else if (field === "model") {
      setFilter({ ...filter, model: value, generation: "" });
    } else {
      setFilter({ ...filter, generation: value });
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
      if (mode === "edit" && car) {
        reset({
          year: car.year,
          description: car.description,
          color: car.color,
          mileage: car.mileage,
          ownersCount: car.ownersCount,
          transmissionType: undefined,
          bodyType: undefined,
          engineType: undefined,
          driveType: undefined,

          // transmissionType:
          //   typeof car.transmissionType === "string"
          //     ? (car.transmissionType as TransmissionType)
          //     : undefined,
          // bodyType:
          //   typeof car.bodyType === "string"
          //     ? (car.bodyType as BodyType)
          //     : undefined,
          enginePower: car.enginePower,
          // engineType:
          //   typeof car.engineType === "string"
          //     ? (car.engineType as EngineType)
          //     : undefined,
          // driveType:
          //   typeof car.driveType === "string"
          //     ? (car.driveType as DriveType)
          //     : undefined,
          engineCapacity: car.engineCapacity,
          steeringPosition: undefined,
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
      }
    }
  }, [isOpen, mode, car, reset]);

  const onSubmit: SubmitHandler<CarCreationDto> = (data) => {
    if (mode === "create") {
      if (
        !filter.brand?.trim() ||
        !filter.model?.trim() ||
        !filter.generation?.trim()
      ) {
        alert(
          "Пожалуйста, заполните обязательные поля: Марка, Модель и Поколение",
        );
        return;
      }
      data.carModelDto = {
        brand: filter.brand,
        model: filter.model,
        generation: filter.generation,
      };
      onCreateCar(data);
    } else if (mode === "edit" && car?.id) {
      onUpdateCar(car.id, data);
    }
    onClose();
  };

  const watchDropdownValue = (fieldName: keyof CarCreationDto): string => {
    const val = watch(fieldName);
    return (val as string) || "";
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
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
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
                    "Марка",
                  )}
                  {errors.carModelDto?.brand && (
                    <span className={styles.error}>Марка обязательна</span>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label>Модель*</label>
                  {renderDropdown(
                    "model",
                    modelOptions,
                    isLoading || !filter.brand,
                    "Модель",
                  )}
                  {errors.carModelDto?.model && (
                    <span className={styles.error}>Модель обязательна</span>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label>Поколение*</label>
                  {renderDropdown(
                    "generation",
                    generationOptions,
                    isLoading || !filter.model,
                    "Поколение",
                  )}
                  {errors.carModelDto?.generation && (
                    <span className={styles.error}>Поколение обязательно</span>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}

            <div className={styles.fieldGroup}>
              <label>Год</label>
              <input type="number" placeholder="Год" {...register("year")} />
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
              <label>Цвет</label>
              <input type="text" placeholder="Цвет" {...register("color")} />
            </div>

            <div className={styles.fieldGroup}>
              <label>Пробег</label>
              <input
                type="number"
                placeholder="Пробег"
                {...register("mileage")}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Владельцев</label>
              <input
                type="number"
                placeholder="Владельцев"
                {...register("ownersCount")}
              />
            </div>

            {/* Dropdown для TransmissionType */}
            <div className={styles.fieldGroup}>
              <label>Коробка передач</label>
              <Dropdown
                options={[
                  { value: "", labelKey: "Не выбрано" },
                  ...transmissionOptions,
                ]}
                value={watchDropdownValue("transmissionType")}
                onChange={(val) =>
                  setValue("transmissionType", val as TransmissionType)
                }
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Тип кузова</label>
              <Dropdown
                options={[
                  { value: "", labelKey: "Не выбрано" },
                  ...bodyTypeOptions,
                ]}
                value={watchDropdownValue("bodyType")}
                onChange={(val) => setValue("bodyType", val as BodyType)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Мощность (л.с.)</label>
              <input
                type="text"
                placeholder="Мощность"
                {...register("enginePower")}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Тип двигателя</label>
              <Dropdown
                options={[
                  { value: "", labelKey: "Не выбрано" },
                  ...engineTypeOptions,
                ]}
                value={watchDropdownValue("engineType")}
                onChange={(val) => setValue("engineType", val as EngineType)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Тип привода</label>
              <Dropdown
                options={[
                  { value: "", labelKey: "Не выбрано" },
                  ...driveTypeOptions,
                ]}
                value={watchDropdownValue("driveType")}
                onChange={(val) => setValue("driveType", val as DriveType)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Объём двигателя (л)</label>
              <input
                type="text"
                placeholder="Объём"
                {...register("engineCapacity")}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Расположение руля</label>
              <Dropdown
                options={[
                  { value: "", labelKey: "Не выбрано" },
                  ...steeringOptions,
                ]}
                value={watchDropdownValue("steeringPosition")}
                onChange={(val) =>
                  setValue("steeringPosition", val as SteeringPosition)
                }
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Количество мест</label>
              <input
                type="number"
                placeholder="Мест"
                {...register("seatsCount")}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Цена</label>
              <input type="number" placeholder="Цена" {...register("price")} />
            </div>

            <div className={styles.fieldGroup}>
              <label>VIN</label>
              <input type="text" placeholder="VIN" {...register("vin")} />
            </div>

            <div className={styles.formActions}>
              <Button type="submit">
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
