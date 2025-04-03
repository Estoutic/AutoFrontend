import React from "react";
import styles from "./Text.module.scss";

interface TextProps {
  children: React.ReactNode;
  variant?: "blue" | "white";

}

const Text = ({ children, variant = "blue" }: TextProps) => {
  return <div className={`${styles.text} ${styles[variant]} `}>{children}</div>;
};

export default Text;
