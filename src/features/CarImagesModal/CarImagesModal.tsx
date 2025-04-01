import React, { useState } from "react";
import { useGetCarImages, useUploadMultipleImages, useDeleteImage } from "@/shared/api/image/hooks";
import { CarResponseDto } from "@/shared/api/car/types";
import Button from "@/shared/ui/Button/Button";
import styles from "./CarImagesModal.module.scss";
import { useNotifications } from "@/shared/hooks/useNotifications";

interface CarImagesModalProps {
  car: CarResponseDto;
  onClose: () => void;
}

const CarImagesModal: React.FC<CarImagesModalProps> = ({ car, onClose }) => {
  const { showSuccess, showError, showInfo, showWarning } = useNotifications();
  const { data, isLoading, isError, refetch } = useGetCarImages(car.id);
  const uploadMultipleMutation = useUploadMultipleImages();
  const deleteMutation = useDeleteImage();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Проверка типов файлов
      const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
      if (invalidFiles.length > 0) {
        showWarning("Выбраны файлы неверного формата. Пожалуйста, выбирайте только изображения.", 
                    "Некорректный формат");
        
        // Фильтрация только изображений
        const validFiles = files.filter(file => file.type.startsWith('image/'));
        setSelectedFiles(validFiles);
        return;
      }
      
      // Проверка размера файлов (ограничение в 5MB)
      const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        showWarning("Некоторые файлы превышают допустимый размер 5MB.", 
                    "Превышен размер");
        
        // Фильтрация файлов подходящего размера
        const validSizeFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
        setSelectedFiles(validSizeFiles);
        return;
      }
      
      setSelectedFiles(files);
      showInfo(`Выбрано ${files.length} изображений`, "Выбор файлов");
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      showWarning("Пожалуйста, выберите файлы для загрузки", "Отсутствуют файлы");
      return;
    }
    
    setUploading(true);
    uploadMultipleMutation.mutate({ carId: car.id, files: selectedFiles }, {
      onSuccess: () => {
        showSuccess(`Успешно загружено ${selectedFiles.length} изображений`, "Загрузка завершена");
        setSelectedFiles([]);
        refetch();
        setUploading(false);
        
        // Сброс input file
        const fileInput = document.getElementById('car-image-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || error?.message || "Неизвестная ошибка";
        showError(`Ошибка при загрузке изображений: ${errorMessage}`, "Ошибка загрузки");
        setUploading(false);
      }
    });
  };

  const handleDelete = (photoId: string) => {
    deleteMutation.mutate({ carId: car.id, photoId }, {
      onSuccess: () => {
        showSuccess("Изображение успешно удалено", "Удаление изображения");
        refetch();
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || error?.message || "Неизвестная ошибка";
        showError(`Ошибка при удалении изображения: ${errorMessage}`, "Ошибка удаления");
      }
    });
  };

  const confirmDelete = (photoId: string) => {
    if (window.confirm("Вы уверены, что хотите удалить это изображение?")) {
      handleDelete(photoId);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Фотографии автомобиля </h3>
          <Button className={styles.closeButton} onClick={onClose}>&times;</Button>
        </div>
        <div className={styles.modalBody}>
          {isLoading ? (
            <div className={styles.loadingState}>Загрузка изображений...</div>
          ) : isError ? (
            <div className={styles.errorState}>
              <p>Ошибка загрузки изображений</p>
              <Button onClick={() => refetch()}>Попробовать снова</Button>
            </div>
          ) : (
            <>
              {data && data.images.length > 0 ? (
                <div className={styles.imagesGrid}>
                  {data.images.map((img) => (
                    <div key={img.id} className={styles.imageItem}>
                      <div className={styles.imageContainer}>
                        <img src={img.path} alt={`Фото ${img.id}`} />
                        <div className={styles.imageOverlay}>
                          <Button
                            variant="secondary"
                            className={styles.deleteButton}
                            onClick={() => confirmDelete(img.id)}
                            disabled={deleteMutation.isLoading}
                          >
                            {deleteMutation.isLoading && deleteMutation.variables?.photoId === img.id
                              ? "Удаление..." 
                              : "Удалить"
                            }
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p>Изображения отсутствуют</p>
                  <p>Загрузите фотографии автомобиля, используя форму ниже</p>
                </div>
              )}

              <div className={styles.uploadSection}>
                <h4>Загрузка новых изображений</h4>
                <div className={styles.uploadControls}>
                  <input 
                    id="car-image-upload"
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleFileChange} 
                    className={styles.fileInput}
                    disabled={uploading}
                  />
                  <Button 
                    onClick={handleUpload} 
                    disabled={selectedFiles.length === 0 || uploading}
                    className={styles.uploadButton}
                  >
                    {uploading ? "Загрузка..." : `Загрузить (${selectedFiles.length})`}
                  </Button>
                </div>
                {selectedFiles.length > 0 && (
                  <div className={styles.selectedFiles}>
                    <p>Выбрано файлов: {selectedFiles.length}</p>
                    <Button 
                      variant="secondary" 
                      onClick={() => setSelectedFiles([])}
                      disabled={uploading}
                    >
                      Очистить
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarImagesModal;