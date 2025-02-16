import React from "react";
import styles from "./CarCard.module.scss";

interface CarCardProps {
  image: string;
  name: string;
  price: string;
}

const CarCard = ({ image, name, price }: CarCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={image} alt={name} className={styles.image} />
      </div>
      <div className={styles.details}>
        <span className={styles.name}>{name}</span>
        <span className={styles.price}>{price}</span>
      </div>
    </div>
  );
};

export default CarCard;
