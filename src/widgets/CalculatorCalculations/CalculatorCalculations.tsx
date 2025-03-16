// src/widgets/CalculatorCalculations/CalculatorCalculations.tsx
import React from 'react';
import { CustomsCalculationResponseDto } from '@/shared/api/calculator/types';
import styles from './CalculatorCalculations.module.scss';

interface CalculatorCalculationsProps {
  result: CustomsCalculationResponseDto | null;
  visible: boolean;
}

const CalculatorCalculations: React.FC<CalculatorCalculationsProps> = ({
  result,
  visible
}) => {
  if (!visible || !result) return null;

  // Helper function to format numbers with thousand separators
  const formatNumber = (num: number): string => {
    return num.toLocaleString('ru-RU');
  };

  return (
    <div className={styles.calculationsContainer}>
      <div className={styles.header}>
        <h2>Результаты расчета таможенных платежей</h2>
      </div>
      
      <div className={styles.resultsTableWrapper}>
        <table className={styles.resultsTable}>
          <tbody>
            <tr>
              <td>Режим расчета</td>
              <td>{result.mode}</td>
            </tr>
            {result.priceRub > 0 && (
              <tr>
                <td>Стоимость автомобиля в рублях</td>
                <td>{formatNumber(result.priceRub)} ₽</td>
              </tr>
            )}
            <tr>
              <td>Пошлина</td>
              <td>{formatNumber(result.dutyRub)} ₽</td>
            </tr>
            <tr>
              <td>Акциз</td>
              <td>{formatNumber(result.exciseRub)} ₽</td>
            </tr>
            <tr>
              <td>НДС</td>
              <td>{formatNumber(result.vatRub)} ₽</td>
            </tr>
            <tr>
              <td>Таможенный сбор</td>
              <td>{formatNumber(result.clearanceFee)} ₽</td>
            </tr>
            <tr>
              <td>Утилизационный сбор</td>
              <td>{formatNumber(result.recyclingFee)} ₽</td>
            </tr>
            {result.utilFee > 0 && (
              <tr>
                <td>Сбор за утилизацию (базовый)</td>
                <td>{formatNumber(result.utilFee)} ₽</td>
              </tr>
            )}
            <tr className={styles.totalRow}>
              <td>Итого к оплате</td>
              <td>{formatNumber(result.totalPay)} ₽</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalculatorCalculations;