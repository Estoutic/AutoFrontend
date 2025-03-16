// src/widgets/Calculator/Calculator.tsx
import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Dropdown from "@/shared/ui/Dropdown/Dropdown";
import InputField from "@/shared/ui/InputField/InputField";
import {
  CAR_AGE,
  CURRNECY_CODE,
  VEHICLE_OWNER_TYPE,
} from "@/shared/constants/calculatorOptions";
import { ENGINE_OPTIONS } from "@/shared/constants/carOptions";
import CalculatorCalculations from "../CalculatorCalculations/CalculatorCalculations";
import styles from "./Calculator.module.scss";
import {
  CustomsCalculationRequestDto,
  CustomsCalculationResponseDto,
} from "@/shared/api/calculator/types";
import { useCalculateCustoms } from "@/shared/api/calculator/hooks";
import Button from "@/shared/ui/Button/Button";

type CalculatorFormData = CustomsCalculationRequestDto;

const Calculator: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields, dirtyFields, submitCount },
    watch,
  } = useForm<CalculatorFormData>({
    defaultValues: {
      age: "",
      engineCapacity: undefined,
      engineType: "",
      power: undefined,
      price: undefined,
      ownerType: "",
      currency: "",
      mode: "ETC",
    },
    mode: "onChange",
  });

  const [result, setResult] = useState<CustomsCalculationResponseDto | null>(
    null,
  );
  const [showResults, setShowResults] = useState(false);
  const calculateMutation = useCalculateCustoms();
  
  // Наблюдаем за всеми полями формы
  const formValues = watch();

  // Функция для определения, нужно ли показывать сообщение об ошибке
  const shouldShowRequiredError = (fieldName: keyof CalculatorFormData) => {
    // Показываем ошибку только если:
    // 1. Форма была отправлена хотя бы раз ИЛИ
    // 2. Поле было "тронуто" (пользователь взаимодействовал с ним)
    // И при этом поле пустое или не определено
    return (submitCount > 0 || touchedFields[fieldName]) && 
           (!formValues[fieldName] || formValues[fieldName] === "");
  };

  const onSubmit: SubmitHandler<CalculatorFormData> = (data) => {
    calculateMutation.mutate(data, {
      onSuccess: (res) => {
        setResult(res);
        setShowResults(true);
        // Scroll to results after a short delay to ensure rendering
        setTimeout(() => {
          const resultsElement = document.getElementById("calculation-results");
          if (resultsElement) {
            resultsElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      },
      onError: (err) => {
        alert("Ошибка расчёта: " + err);
        setShowResults(false);
      },
    });
  };

  return (
    <div className={styles.calculatorWrapper}>
      <div className={styles.calculator}>
        <h2>Калькулятор таможенных платежей</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.flexRow}>
            {/* Возраст авто */}
            <div className={styles.formField}>
              <Controller
                name="age"
                control={control}
                rules={{ required: "Обязательное поле" }}
                render={({ field }) => (
                  <Dropdown
                    options={CAR_AGE}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Возраст авто"
                  />
                )}
              />
              {errors.age && (
                <div className={styles.errorText}>{errors.age.message}</div>
              )}
              {shouldShowRequiredError('age') && !errors.age && (
                <div className={styles.errorText}>Обязательное поле</div>
              )}
            </div>
            {/* Цена авто */}
            <div className={styles.formField}>
              <Controller
                name="price"
                control={control}
                rules={{
                  required: "Обязательное поле",
                  min: { value: 1, message: "Цена должна быть больше 0" },
                }}
                render={({ field }) => (
                  <InputField
                    type="number"
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Цена авто"
                  />
                )}
              />
              {errors.price && (
                <div className={styles.errorText}>{errors.price.message}</div>
              )}
              {shouldShowRequiredError('price') && !errors.price && (
                <div className={styles.errorText}>Обязательное поле</div>
              )}
            </div>
            {/* Валюта */}
            <div className={styles.formField}>
              <Controller
                name="currency"
                control={control}
                rules={{ required: "Обязательное поле" }}
                render={({ field }) => (
                  <Dropdown
                    options={CURRNECY_CODE}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Валюта"
                  />
                )}
              />
              {errors.currency && (
                <div className={styles.errorText}>
                  {errors.currency.message}
                </div>
              )}
              {shouldShowRequiredError('currency') && !errors.currency && (
                <div className={styles.errorText}>Обязательное поле</div>
              )}
            </div>
          </div>
          <div className={styles.flexRow}>
            {/* Тип двигателя */}
            <div className={styles.formField}>
              <Controller
                name="engineType"
                control={control}
                rules={{ required: "Обязательное поле" }}
                render={({ field }) => (
                  <Dropdown
                    options={ENGINE_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Тип двигателя"
                  />
                )}
              />
              {errors.engineType && (
                <div className={styles.errorText}>
                  {errors.engineType.message}
                </div>
              )}
              {shouldShowRequiredError('engineType') && !errors.engineType && (
                <div className={styles.errorText}>Обязательное поле</div>
              )}
            </div>
            {/* Объём двигателя */}
            <div className={styles.formField}>
              <Controller
                name="engineCapacity"
                control={control}
                rules={{
                  required: "Обязательное поле",
                  min: { value: 0.1, message: "Минимальный объем 0.1 л" },
                  max: { value: 10, message: "Максимальный объем 10 л" },
                }}
                render={({ field }) => (
                  <InputField
                    type="number"
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Объем двигателя (л)"
                  />
                )}
              />
              {errors.engineCapacity && (
                <div className={styles.errorText}>
                  {errors.engineCapacity.message}
                </div>
              )}
              {shouldShowRequiredError('engineCapacity') && !errors.engineCapacity && (
                <div className={styles.errorText}>Обязательное поле</div>
              )}
            </div>
            {/* Мощность */}
            <div className={styles.formField}>
              <Controller
                name="power"
                control={control}
                rules={{
                  required: "Обязательное поле",
                  min: { value: 1, message: "Минимальная мощность 1 л.с." },
                }}
                render={({ field }) => (
                  <InputField
                    type="number"
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Мощность (л.с.)"
                  />
                )}
              />
              {errors.power && (
                <div className={styles.errorText}>{errors.power.message}</div>
              )}
              {shouldShowRequiredError('power') && !errors.power && (
                <div className={styles.errorText}>Обязательное поле</div>
              )}
            </div>
          </div>
          <div className={styles.formActionsRow}>
            {/* Тип владельца */}
            <div className={styles.ownerTypeField}>
              <Controller
                name="ownerType"
                control={control}
                rules={{ required: "Обязательное поле" }}
                render={({ field }) => (
                  <Dropdown
                    options={VEHICLE_OWNER_TYPE}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Тип владельца"
                  />
                )}
              />
              {errors.ownerType && (
                <div className={styles.errorText}>{errors.ownerType.message}</div>
              )}
              {shouldShowRequiredError('ownerType') && !errors.ownerType && (
                <div className={styles.errorText}>Обязательное поле</div>
              )}
            </div>

            <button
              type="submit"
              disabled={calculateMutation.isLoading}
              className={styles.calculateButton}
            >
              {calculateMutation.isLoading ? "Рассчитываем..." : "Рассчитать"}
            </button>
          </div>
        </form>
      </div>
      {/* Результаты расчета (отображаются под формой) */}
      <div id="calculation-results" className={styles.resultsContainer}>
        <CalculatorCalculations result={result} visible={showResults} />
      </div>
    </div>
  );
};

export default Calculator;