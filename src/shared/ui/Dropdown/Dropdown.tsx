import React from "react";
import styles from "./Dropdown.module.scss";
import arrowIcon from "@/assets/arrow.svg"; // Импорт SVG-иконки
import { useTranslation } from "react-i18next";

interface DropdownProps {
  options: { value: string; labelKey: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean; // Добавляем опциональное свойство disabled
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  disabled,
}) => {
  const { t } = useTranslation();
  return (
    <div className={styles.dropdownWrapper}>
      <select
        className={styles.dropdown}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled} // Передаем свойство disabled
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {t(option.labelKey)}
          </option>
        ))}
      </select>
      <img src={arrowIcon} alt="Arrow" className={styles.arrowIcon} />
    </div>
  );
};

export default Dropdown;