import React from "react";
import styles from "./CarCard.module.scss";
import bmwFallback from "@/assets/bmw.png";

interface CarCardProps {
  images: string[];
  name: string;
  price: number;
}

const CarCard = ({ images, name, price }: CarCardProps) => {

  const image = images.length ? images[0] : bmwFallback;

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={image} alt={name} className={styles.image} />
      </div>
      <div className={styles.details}>
        <span className={styles.name}>{name}</span>
        <span className={styles.price}>{price} руб.</span>
      </div>
    </div>
  );
};

export default CarCard;
