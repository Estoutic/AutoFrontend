import React from "react";
import styles from "./CarCard.module.scss";
import bmwFallback from "@/assets/bmw.png";

interface CarCardProps {
  images: string[];
  name: string;
  price: number;
  subModel?: string;
}

const CarCard: React.FC<CarCardProps> = ({ images, name, price, subModel }) => {
  const image = images.length ? images[0] : bmwFallback;
  
  const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={image} alt={name} />
      </div>
      <div className={styles.details}>
        <div className={styles.modelWrapper}>
          <span className={styles.name}>{name}</span>
          {subModel && <span className={styles.subModel}>{subModel}</span>}
        </div>
        <span className={styles.price}>{formattedPrice} руб.</span>
      </div>
    </div>
  );
};

export default CarCard;