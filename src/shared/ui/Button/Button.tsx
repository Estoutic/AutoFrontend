import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  children,
  variant = 'primary'
}) => {
  const buttonClasses = `
    ${styles.button} 
    ${styles[variant]} 
    ${className} 
    ${disabled ? styles.disabled : ''}
  `.trim();

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;