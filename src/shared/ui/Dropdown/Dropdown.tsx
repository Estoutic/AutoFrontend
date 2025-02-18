import React from "react";
import styles from "./Dropdown.module.scss";
import arrowIcon from "@/assets/arrow.svg"; // Импорт SVG-иконки

interface DropdownProps {
  options: { value: string; labelKey: string }[];  
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Dropdown = ({ options, value, onChange, placeholder }: DropdownProps) => {
  return (
    <div className={styles.dropdownWrapper}>
      <select
        className={styles.dropdown}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.labelKey}
          </option>
        ))}
      </select>
      <img src={arrowIcon} alt="Arrow" className={styles.arrowIcon} />
    </div>
  );
};

export default Dropdown;