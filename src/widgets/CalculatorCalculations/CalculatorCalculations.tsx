// src/widgets/CalculatorCalculations/CalculatorCalculations.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  
  if (!visible || !result) return null;

  // Helper function to format numbers with thousand separators
  const formatNumber = (num: number): string => {
    return num.toLocaleString('ru-RU');
  };

  return (
    <div className={styles.calculationsContainer}>
      <div className={styles.header}>
        <h3>{t("calculator.resultsTitle")}</h3>
      </div>
      
      <div className={styles.resultsTableWrapper}>
        <table className={styles.resultsTable}>
          <tbody>
            <tr>
              <td>{t("calculator.calculationMode")}</td>
              <td>{result.mode}</td>
            </tr>
            {result.priceRub > 0 && (
              <tr>
                <td>{t("calculator.carPriceRub")}</td>
                <td>{formatNumber(result.priceRub)} ₽</td>
              </tr>
            )}
            <tr>
              <td>{t("calculator.duty")}</td>
              <td>{formatNumber(result.dutyRub)} ₽</td>
            </tr>
            <tr>
              <td>{t("calculator.exciseTax")}</td>
              <td>{formatNumber(result.exciseRub)} ₽</td>
            </tr>
            <tr>
              <td>{t("calculator.vat")}</td>
              <td>{formatNumber(result.vatRub)} ₽</td>
            </tr>
            <tr>
              <td>{t("calculator.customsFee")}</td>
              <td>{formatNumber(result.clearanceFee)} ₽</td>
            </tr>
            <tr>
              <td>{t("calculator.recyclingFee")}</td>
              <td>{formatNumber(result.recyclingFee)} ₽</td>
            </tr>
            {result.utilFee > 0 && (
              <tr>
                <td>{t("calculator.utilizationFeeBase")}</td>
                <td>{formatNumber(result.utilFee)} ₽</td>
              </tr>
            )}
            <tr className={styles.totalRow}>
              <td>{t("calculator.totalPayment")}</td>
              <td>{formatNumber(result.totalPay)} ₽</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalculatorCalculations;