// src/widgets/Calculator/Calculator.tsx
import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
 
import Dropdown from "@/shared/ui/Dropdown/Dropdown";
import InputField from "@/shared/ui/InputField/InputField";
import { CAR_AGE, CURRNECY_CODE, PERSON, VEHICLE_OWNER_TYPE } from "@/shared/constants/calculatorOptions";
import { ENGINE_OPTIONS } from "@/shared/constants/carOptions";
import CalculatorCalculations from "../CalculatorCalculations/CalculatorCalculations";
import styles from "./Calculator.module.scss";
import Button from "@/shared/ui/Button/Button";
import { CustomsCalculationRequestDto, CustomsCalculationResponseDto } from "@/shared/api/calculator/types";
import { useCalculateCustoms } from "@/shared/api/calculator/hooks";


type CalculatorFormData = CustomsCalculationRequestDto;

const Calculator: React.FC = () => {
  const { control, handleSubmit } = useForm<CalculatorFormData>({
    defaultValues: {
      age: "",
      engineCapacity: 0,
      engineType: "",
      power: 0,
      price: 0,
      ownerType: "",
      currency: "",
      mode: "ETC", 
    },
  });

  const [result, setResult] = useState<CustomsCalculationResponseDto | null>(null);
  const [visible, setVisible] = useState(false);

  const calculateMutation = useCalculateCustoms();

  const onSubmit: SubmitHandler<CalculatorFormData> = (data) => {
    calculateMutation.mutate(data, {
      onSuccess: (res) => {
        setResult(res);
        setVisible(true);
      },
      onError: (err) => {
        alert("Ошибка расчёта: " + err);
      },
    });
  };

  return (
    <div className={styles.calculator}>
      <h2>Калькулятор таможенных платежей</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.flexRow}>
          {/* Возраст авто */}
          <Controller
            name="age"
            control={control}
            render={({ field }) => (
              <Dropdown
                options={CAR_AGE}
                value={field.value}
                onChange={field.onChange}
                placeholder="Возраст авто"
              />
            )}
          />

          {/* Цена авто */}
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <InputField
                type="number"
                value={field.value}
                onChange={field.onChange}
                placeholder="Цена авто"
              />
            )}
          />

          {/* Валюта */}
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <Dropdown
                options={CURRNECY_CODE}
                value={field.value}
                onChange={field.onChange}
                placeholder="Валюта"
              />
            )}
          />
        </div>

        <div className={styles.flexRow}>
          {/* Тип двигателя */}
          <Controller
            name="engineType"
            control={control}
            render={({ field }) => (
              <Dropdown
                options={ENGINE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Тип двигателя"
              />
            )}
          />

          {/* Объём двигателя */}
          <Controller
            name="engineCapacity"
            control={control}
            render={({ field }) => (
              <InputField
                type="number"
                value={field.value}
                onChange={field.onChange}
                placeholder="Объем двигателя (л)"
              />
            )}
          />

          {/* Мощность */}
          <Controller
            name="power"
            control={control}
            render={({ field }) => (
              <InputField
                type="number"
                value={field.value}
                onChange={field.onChange}
                placeholder="Мощность (л.с.)"
              />
            )}
          />
        </div>

        <div className={styles.flexRow}>
          {/* Тип владельца */}
          <Controller
            name="ownerType"
            control={control}
            render={({ field }) => (
              <Dropdown
                options={VEHICLE_OWNER_TYPE}
                value={field.value}
                onChange={field.onChange}
                placeholder="Тип владельца"
              />
            )}
          />

          <Button type="submit">
            {calculateMutation.isLoading ? "Рассчитываем..." : "Рассчитать"}
          </Button>
        </div>
      </form>

      {visible && result && (
        <CalculatorCalculations result={result} />
      )}
    </div>
  );
};

export default Calculator;