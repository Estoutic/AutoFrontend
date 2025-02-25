import React from 'react';
import styles from './CalculationTable.module.scss';

interface CalculationRow {
  label: string;
  value: string;
}

interface CalculationTableProps {
  title?: string;
  rows: CalculationRow[];
}

const CalculationTable = ({ title, rows }: CalculationTableProps) => {
  return (
    <div className={styles.tableContainer}>
      {title && <h3 className={styles.tableTitle}>{title}</h3>}

      <table className={styles.calculationTable}>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              <td className={styles.cellLabel}>{row.label}</td>
              <td className={styles.cellValue}>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CalculationTable;