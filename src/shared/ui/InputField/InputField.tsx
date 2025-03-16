// src/shared/ui/InputField/InputField.tsx
import React from "react";
import styles from "./InputField.module.scss";

interface InputFieldProps {
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Updated to accept the event object
  placeholder?: string;
  type?: "text" | "number";
  error?: string; // Added error prop
}

const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}) => {
  return (
    <div className={styles.inputContainer}>
     <input
      type={type}
      className={`${styles.input} ${error ? styles.error : ''}`}
      value={value === undefined ? "" : value}
      onChange={onChange} // Pass the event directly
      placeholder={placeholder}
     />
     {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default InputField;