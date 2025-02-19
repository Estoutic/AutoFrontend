import React from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary"; 
  disabled?: boolean;
  classname?: string;
}

const Button = ({ children, onClick, variant = "primary", disabled = false, classname = "" }: ButtonProps) => {
  return (
    <button 
      className={`${styles.button} ${styles[variant]} ${styles[classname]}`} 
      onClick={onClick} 
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;