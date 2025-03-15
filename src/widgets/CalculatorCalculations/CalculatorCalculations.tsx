// src/widgets/Calculator/CalculatorCalculations.tsx
import React from "react";
import CalculationTable from "@/entities/CalculationTable/CalculationTable";
import CustomsFeesTable from "@/entities/CustomsFeesTable/CustomsFeesTable";
import { CustomsCalculationResponseDto } from "@/shared/api/calculator/types";

interface CalculatorCalculationsProps {
  result: CustomsCalculationResponseDto;
}

const CalculatorCalculations: React.FC<CalculatorCalculationsProps> = ({ result }) => {
  // Пример: часть данных выводим в CalculationTable, часть — в CustomsFeesTable
  const rows = [
    { label: "Режим:", value: result.mode },
    { label: "Цена в руб:", value: result.priceRub.toString() },
    { label: "Пошлина:", value: result.dutyRub.toString() },
    { label: "Акциз:", value: result.exciseRub.toString() },
    { label: "НДС:", value: result.vatRub.toString() },
  ];

  const feesRows = [
    {
      feeType: "Таможенный сбор",
      base: "---",
      rate: "---",
      sumRub: result.clearanceFee.toString(),
      sumCny: "---",
    },
    {
      feeType: "Утилизационный сбор",
      base: "---",
      rate: "---",
      sumRub: result.recyclingFee.toString(),
      sumCny: "---",
    },
    {
      feeType: "Сбор за утилизацию",
      base: "---",
      rate: "---",
      sumRub: result.utilFee.toString(),
      sumCny: "---",
    },
  ];

  const totalRow = {
    feeType: "Итого:",
    base: "---",
    rate: "---",
    sumRub: result.totalPay.toString(),
    sumCny: "---",
  };

  return (
    <div>
      <CalculationTable title="Схема расчёта:" rows={rows} />
      <CustomsFeesTable title="Таможенные сборы" rows={feesRows} total={totalRow} />
    </div>
  );
};

export default CalculatorCalculations;