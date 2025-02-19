
import React from 'react';
import styles from './CustomsFeesTable.module.scss';

interface FeeRow {
  feeType: string;       
  base: string;        
  rate: string;         
  sumRub: string;       
  sumCny: string;       
}

interface CustomsFeesTableProps {
  title?: string;       
  rows: FeeRow[];        
  total?: FeeRow;      
}

const CustomsFeesTable: React.FC<CustomsFeesTableProps> = ({ title, rows, total }) => {
  return (
    <div className={styles.tableContainer}>
      {title && <h3>{title}</h3>}

      <table className={styles.customsFeesTable}>
        <thead>
          <tr>
            <th>Вид сбора</th>
            <th>Основа начисления</th>
            <th>Ставка</th>
            <th>Сумма (руб)</th>
            <th>Сумма (CNY)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              <td>{row.feeType}</td>
              <td>{row.base}</td>
              <td>{row.rate}</td>
              <td>{row.sumRub}</td>
              <td>{row.sumCny}</td>
            </tr>
          ))}

          {total && (
            <tr className={styles.tableFooter}>
              <td>{total.feeType}</td>
              <td>{total.base}</td>
              <td>{total.rate}</td>
              <td>{total.sumRub}</td>
              <td>{total.sumCny}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomsFeesTable;