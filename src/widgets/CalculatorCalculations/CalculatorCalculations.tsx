import CalculationTable from "@/entities/CalculationTable/CalculationTable";
import CustomsFeesTable from "@/entities/CustomsFeesTable/CustomsFeesTable";
import React from "react";

const CalculatorCalculations = () => {
  const rows = [
    { label: "Возраст:", value: "xxxxxx" },
    { label: "Таможенная стоимость автомобиля:", value: "xxxxxx" },
    { label: "Таможенная стоимость в рублях:", value: "xxxxxx" },
    { label: "Объем двигателя:", value: "xxxxxx" },
    { label: "Мощность двигателя:", value: "xxxxxx" },
    { label: "Тип двигателя:", value: "xxxxxx" },
    { label: "Курс USD:", value: "xxxxxx" },
    { label: "Курс EUR:", value: "xxxxxx" },
    { label: "Курс CNY:", value: "xxxxxx" },
  ];

  const endRows = [
    {
      feeType: 'Таможенный сбор:',
      base: 'xxxxxxx',
      rate: 'xxxxxxx',
      sumRub: 'xxxxxxx',
      sumCny: 'xxxxxxx',
    },
    {
      feeType: 'Пошлина:',
      base: 'xxxxxxx',
      rate: 'xxxxxxx',
      sumRub: 'xxxxxxx',
      sumCny: 'xxxxxxx',
    },
    {
      feeType: 'Расчет утилизационного сбора (старше 3-х лет, ...):',
      base: 'xxxxxxx',
      rate: 'xxxxxxx',
      sumRub: 'xxxxxxx',
      sumCny: 'xxxxxxx',
    },
  ];
  const totalRow = {
    feeType: 'Итого:',
    base: 'xxxxxxx',
    rate: 'xxxxxxx',
    sumRub: 'xxxxxxx',
    sumCny: 'xxxxxxx',
  };

  return (
    <div>
      <CalculationTable title="Схема расчета:" rows={rows} />
      <CustomsFeesTable
        title="Таможенные сборы"
        rows={endRows}
        total={totalRow}></CustomsFeesTable>
    </div>
  );
};

export default CalculatorCalculations;
