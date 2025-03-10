import React, { useState } from "react";
import { useGetCarImages, useUploadMultipleImages, useDeleteImage } from "@/shared/api/image/hooks";
import { CarResponseDto } from "@/shared/api/car/types";
import Button from "@/shared/ui/Button/Button";
import styles from "./CarImagesModal.module.scss";

interface CarImagesModalProps {
  car: CarResponseDto;
  onClose: () => void;
}

const CarImagesModal: React.FC<CarImagesModalProps> = ({ car, onClose }) => {
  const { data, isLoading, isError } = useGetCarImages(car.id);
  const uploadMultipleMutation = useUploadMultipleImages();
  const deleteMutation = useDeleteImage();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Можем поддерживать загрузку нескольких файлов
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;
    uploadMultipleMutation.mutate({ carId: car.id, files: selectedFiles });
  };

  const handleDelete = (photoId: string) => {
    if (window.confirm("Удалить изображение?")) {
      deleteMutation.mutate({ carId: car.id, photoId });
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Фотографии автомобиля</h3>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.modalBody}>
          {isLoading && <div>Загрузка изображений...</div>}
          {isError && <div>Ошибка загрузки изображений</div>}
          {data && data.images.length > 0 ? (
            <div className={styles.imagesGrid}>
              {data.images.map((img) => (
                <div key={img.id} className={styles.imageItem}>
                  <img src={img.path} alt={`Фото ${img.id}`} />
                  <Button
                    variant="secondary"
                    onClick={() => handleDelete(img.id)}
                  >
                    Удалить
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div>Изображения отсутствуют</div>
          )}
          <div className={styles.uploadSection}>
            <input type="file" multiple onChange={handleFileChange} />
            <Button onClick={handleUpload} disabled={selectedFiles.length === 0}>
              Загрузить выбранные
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarImagesModal;