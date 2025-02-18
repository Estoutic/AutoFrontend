import React from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary"; // Можно добавить разные стили
  disabled?: boolean;
}

const Button = ({ children, onClick, variant = "primary", disabled = false }: ButtonProps) => {
  return (
    <button 
      className={`${styles.button} ${styles[variant]}`} 
      onClick={onClick} 
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;