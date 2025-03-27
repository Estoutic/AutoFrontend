import React from "react";
import styles from "./CarCard.module.scss";
import bmwFallback from "@/assets/bmw.png";

interface CarCardProps {
  images: string[];
  name: string;
  price: number;
  subModel?: string;
  isActive?: boolean;
}

// Helper function to format price
const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const CarCard: React.FC<CarCardProps> = ({ 
  images, 
  name, 
  price, 
  subModel, 
  isActive = false 
}) => {
  const image = images && images.length ? images[0] : bmwFallback;
  const formattedPrice = formatPrice(price);

  // Обрезаем длинные имена моделей
  const truncatedName = name.length > 15 ? `${name.substring(0, 15)}...` : name;
  const truncatedSubModel = subModel && subModel.length > 20 
    ? `${subModel.substring(0, 20)}...` 
    : subModel;

  return (
    <div className={`${styles.carCard} ${isActive ? styles.activeCard : ""}`}>
      <div className={styles.cardImage}>
        <img src={image} alt={name} />
      </div>
      <div className={styles.cardDetails}>
        <div className={styles.modelInfo}>
          <span className={styles.modelName}>{truncatedName}</span>
          {truncatedSubModel && (
            <span className={styles.subModel}>{truncatedSubModel}</span>
          )}
        </div>
        <span className={styles.cardPrice}>{formattedPrice} руб.</span>
      </div>
    </div>
  );
};

export default CarCard;