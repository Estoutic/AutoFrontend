import React from "react";
import styles from "./InputField.module.scss";

interface InputFieldProps {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number";
}

const InputField = ({
  value,
  onChange,
  placeholder,
  type = "text",
}: InputFieldProps) => {
  return (
    <div className={styles.inputContainer}>
     <input
      type={type}
      className={styles.input}
      value={value === undefined ? "" : value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
    </div>
  );
};

export default InputField;
