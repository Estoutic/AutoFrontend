import React from "react";
import styles from "./InputField.module.scss";

// Define both possible types of handlers
type EventHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;
type ValueHandler = (value: string | number) => void;

interface InputFieldProps {
  value: string | number;
  onChange: EventHandler | ValueHandler;
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
  // Convert null/undefined to empty string for display
  const displayValue = value === null || value === undefined ? "" : value;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Check if onChange is expecting a React.ChangeEvent (has 'currentTarget' in its params)
    // or just a direct value (Function.length will be 1 for functions with one parameter)
    if (onChange.length === 1) {
      // If it expects one parameter, it could be either a direct value or an event
      try {
        // Try to call it as an event handler first
        (onChange as EventHandler)(e);
      } catch (err) {
        // If that fails, try calling it as a value handler
        (onChange as ValueHandler)(e.target.value);
      }
    } else {
      // For any other case, pass the event (most common usage)
      (onChange as EventHandler)(e);
    }
  };

  return (
    <div className={styles.inputContainer}>
      <input
        type={type}
        className={`${styles.input} ${error ? styles.error : ''}`}
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default InputField;