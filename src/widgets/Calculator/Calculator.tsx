// src/widgets/Calculator/Calculator.tsx
import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Dropdown from "@/shared/ui/Dropdown/Dropdown";
import InputField from "@/shared/ui/InputField/InputField";
import {
  CAR_AGE,
  CURRNECY_CODE,
  VEHICLE_OWNER_TYPE,
  CALCULATION_MODES, // Import the new constant
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
  const { t } = useTranslation();
  
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
      mode: "", // Default mode is ETC
    },
    mode: "onChange",
  });

  const [result, setResult] = useState<CustomsCalculationResponseDto | null>(
    null,
  );
  const [showResults, setShowResults] = useState(false);
  const calculateMutation = useCalculateCustoms();
  
  const formValues = watch();

  const shouldShowRequiredError = (fieldName: keyof CalculatorFormData) => {
    return (submitCount > 0 || touchedFields[fieldName]) && 
           (!formValues[fieldName] || formValues[fieldName] === "");
  };

  const onSubmit: SubmitHandler<CalculatorFormData> = (data) => {
    calculateMutation.mutate(data, {
      onSuccess: (res) => {
        setResult(res);
        setShowResults(true);
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
        alert(t("calculator.errorMessage") + err);
        setShowResults(false);
      },
    });
  };

  return (
    <div className={styles.calculatorWrapper}>
      <div className={styles.calculator}>
        <h2>{t("calculator.titleLine1")}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.flexRow}>
            {/* Car Age */}
            <div className={styles.formField}>
              <Controller
                name="age"
                control={control}
                rules={{ required: t("calculator.requiredField") }}
                render={({ field }) => (
                  <Dropdown
                    options={CAR_AGE}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("calculator.agePlaceholder")}
                  />
                )}
              />
              {errors.age && (
                <div className={styles.errorText}>{errors.age.message}</div>
              )}
              {shouldShowRequiredError('age') && !errors.age && (
                <div className={styles.errorText}>{t("calculator.requiredField")}</div>
              )}
            </div>
            {/* Car Price */}
            <div className={styles.formField}>
              <Controller
                name="price"
                control={control}
                rules={{
                  required: t("calculator.requiredField"),
                  min: { value: 1, message: t("calculator.priceGreaterThanZero") },
                }}
                render={({ field }) => (
                  <InputField
                    type="number"
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder={t("calculator.pricePlaceholder")}
                  />
                )}
              />
              {errors.price && (
                <div className={styles.errorText}>{errors.price.message}</div>
              )}
              {shouldShowRequiredError('price') && !errors.price && (
                <div className={styles.errorText}>{t("calculator.requiredField")}</div>
              )}
            </div>
            {/* Currency */}
            <div className={styles.formField}>
              <Controller
                name="currency"
                control={control}
                rules={{ required: t("calculator.requiredField") }}
                render={({ field }) => (
                  <Dropdown
                    options={CURRNECY_CODE}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("calculator.currencyPlaceholder")}
                  />
                )}
              />
              {errors.currency && (
                <div className={styles.errorText}>
                  {errors.currency.message}
                </div>
              )}
              {shouldShowRequiredError('currency') && !errors.currency && (
                <div className={styles.errorText}>{t("calculator.requiredField")}</div>
              )}
            </div>
          </div>
          <div className={styles.flexRow}>
            {/* Engine Type */}
            <div className={styles.formField}>
              <Controller
                name="engineType"
                control={control}
                rules={{ required: t("calculator.requiredField") }}
                render={({ field }) => (
                  <Dropdown
                    options={ENGINE_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("calculator.engineTypePlaceholder")}
                  />
                )}
              />
              {errors.engineType && (
                <div className={styles.errorText}>
                  {errors.engineType.message}
                </div>
              )}
              {shouldShowRequiredError('engineType') && !errors.engineType && (
                <div className={styles.errorText}>{t("calculator.requiredField")}</div>
              )}
            </div>
            {/* Engine Capacity */}
            <div className={styles.formField}>
              <Controller
                name="engineCapacity"
                control={control}
                rules={{
                  required: t("calculator.requiredField"),
                  min: { value: 0.1, message: t("calculator.minEngineCapacity") },
                  max: { value: 10, message: t("calculator.maxEngineCapacity") },
                }}
                render={({ field }) => (
                  <InputField
                    type="number"
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder={t("calculator.volumePlaceholder")}
                  />
                )}
              />
              {errors.engineCapacity && (
                <div className={styles.errorText}>
                  {errors.engineCapacity.message}
                </div>
              )}
              {shouldShowRequiredError('engineCapacity') && !errors.engineCapacity && (
                <div className={styles.errorText}>{t("calculator.requiredField")}</div>
              )}
            </div>
            {/* Engine Power */}
            <div className={styles.formField}>
              <Controller
                name="power"
                control={control}
                rules={{
                  required: t("calculator.requiredField"),
                  min: { value: 1, message: t("calculator.minPower") },
                }}
                render={({ field }) => (
                  <InputField
                    type="number"
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder={t("calculator.powerPlaceholder")}
                  />
                )}
              />
              {errors.power && (
                <div className={styles.errorText}>{errors.power.message}</div>
              )}
              {shouldShowRequiredError('power') && !errors.power && (
                <div className={styles.errorText}>{t("calculator.requiredField")}</div>
              )}
            </div>
          </div>
          <div className={styles.formActionsRow}>
            {/* Owner Type */}
            <div className={styles.formField}>
              <Controller
                name="ownerType"
                control={control}
                rules={{ required: t("calculator.requiredField") }}
                render={({ field }) => (
                  <Dropdown
                    options={VEHICLE_OWNER_TYPE}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("calculator.personPlaceholder")}
                  />
                )}
              />
              {errors.ownerType && (
                <div className={styles.errorText}>{errors.ownerType.message}</div>
              )}
              {shouldShowRequiredError('ownerType') && !errors.ownerType && (
                <div className={styles.errorText}>{t("calculator.requiredField")}</div>
              )}
            </div>

            {/* Calculation Mode - Added here as the penultimate element */}
            <div className={styles.formField}>
              <Controller
                name="mode"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    options={CALCULATION_MODES}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("calculator.modePlaceholder")}
                  />
                )}
              />
              {errors.mode && (
                <div className={styles.errorText}>{errors.mode.message}</div>
              )}
            </div>

            <Button
              type="submit"
              disabled={calculateMutation.isLoading}
              className={styles.calculateButton}
            >
              {calculateMutation.isLoading ? t("calculator.calculating") : t("calculator.calculateButton")}
            </Button>
          </div>
        </form>
      </div>
      {/* Calculation Results (displayed below the form) */}
      <div id="calculation-results" className={styles.resultsContainer}>
        <CalculatorCalculations result={result} visible={showResults} />
      </div>
    </div>
  );
};

export default Calculator;