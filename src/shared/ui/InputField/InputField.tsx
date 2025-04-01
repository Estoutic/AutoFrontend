import React from "react";
import styles from "./InputField.module.scss";

// Define two possible onChange types
type ChangeEventHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;
type ValueChangeHandler = (value: string) => void;

interface InputFieldProps {
  value: string | number;
  onChange: ChangeEventHandler | ValueChangeHandler; // Accept either type
  placeholder?: string;
  type?: "text" | "number" | "date";
  error?: string;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  disabled = false,
}) => {
  // Handle the change event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Check the number of arguments that onChange expects
    if (onChange.length === 1) {
      // If it expects 1 argument, it could be either type
      // We'll try to detect if it's a React event handler or value handler based on its name
      const handlerName = onChange.name;
      if (handlerName && handlerName.includes("bound ")) {
        // Likely a bound method that expects an event
        (onChange as ChangeEventHandler)(e);
      } else {
        // Likely an arrow function that expects just the value
        (onChange as ValueChangeHandler)(e.target.value);
      }
    } else {
      // Default to passing the entire event if we can't determine
      (onChange as ChangeEventHandler)(e);
    }
  };

  return (
    <div className={styles.inputContainer}>
      <input
        type={type}
        className={`${styles.input} ${error ? styles.error : ''}`}
        value={value === undefined ? "" : value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default InputField;