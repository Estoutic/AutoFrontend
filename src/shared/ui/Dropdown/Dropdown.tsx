import React, { useState, useRef, useEffect } from "react";
import styles from "./Dropdown.module.scss";
import { useTranslation } from "react-i18next";

interface DropdownProps {
  options: { value: string; labelKey: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  error,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find the selected option for display
  const selectedOption = value 
    ? options.find(option => option.value === value)
    : null;

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debug: log options and value
  useEffect(() => {
    console.log("Dropdown options:", options);
    console.log("Dropdown value:", value);
    console.log("Selected option:", selectedOption);
  }, [options, value, selectedOption]);

  return (
    <div className={styles.dropdownWrapper} ref={dropdownRef}>
      <div 
        className={`${styles.dropdownHeader} ${isOpen ? styles.open : ''} ${error ? styles.error : ''} ${disabled ? styles.disabled : ''}`}
        onClick={toggleDropdown}
      >
        <div className={styles.selectedValue}>
          {selectedOption 
            ? (selectedOption.labelKey.startsWith('carFilter.') ? t(selectedOption.labelKey) : selectedOption.labelKey)
            : placeholder || ''}
        </div>
        <div className={styles.arrowIcon}>
          <svg 
            width="10" 
            height="6" 
            viewBox="0 0 10 6" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={isOpen ? styles.rotated : ''}
          >
            <path d="M1 1L5 5L9 1" stroke="#1A3865" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {options.length > 0 ? (
            options.map((option) => (
              <div
                key={option.value}
                className={`${styles.option} ${option.value === value ? styles.selected : ''}`}
                onClick={() => handleOptionClick(option.value)}
              >
                {option.labelKey.startsWith('carFilter.') ? t(option.labelKey) : option.labelKey}
              </div>
            ))
          ) : (
            <div className={styles.emptyOption}>{t('carFilter.noOptions')}</div>
          )}
        </div>
      )}
      
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default Dropdown;