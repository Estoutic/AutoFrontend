import React from "react";
import styles from "./InputField.module.scss";

interface InputFieldProps  {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number";
}

const InputField = ({ value, onChange, placeholder, type = "text" }: InputFieldProps) => {
  return (
    <input
      type={type}
      className={styles.input}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};

export default InputField;