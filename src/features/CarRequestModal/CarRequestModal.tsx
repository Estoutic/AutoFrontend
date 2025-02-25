import React, { useState } from "react";
import styles from "./CarRequestModal.module.scss";
import { CarResponseDto } from "@/shared/api/car/types";
import Text from "@/shared/ui/Text/Text";
import InputField from "@/shared/ui/InputField/InputField";
import Dropdown from "@/shared/ui/Dropdown/Dropdown";
import Button from "@/shared/ui/Button/Button";
import CarDetailCard from "@/entities/CarDetailCard/CarDetailCard";
import { useAddApplication } from "@/shared/api/application/hooks"; // <-- импорт хука
import { ApplicationCreationDto } from "@/shared/api/application/types"; // <-- DTO интерфейс

// Варианты контакта
const CONTACT_TYPE_OPTIONS = [
  { value: "CALL", labelKey: "Звонок" },
  { value: "EMAIL", labelKey: "Email" },
  { value: "WHATSAPP", labelKey: "WhatsApp" },
  { value: "TELEGRAM", labelKey: "Telegram" },
];

// Тип пропсов
interface CarRequestModalProps {
  isOpen: boolean;
  car: CarResponseDto | null;
  branchId?: string;     
  onClose: () => void;  // Закрыть модалку
  // Если хотите, оставьте onSubmit для доп. логики у родителя
  onSubmit?: (data: ApplicationCreationDto) => void; 
}

// Локальный интерфейс формы (совпадает с ApplicationCreationDto)
interface FormDataType extends ApplicationCreationDto {}

const CarRequestModal: React.FC<CarRequestModalProps> = ({
  isOpen,
  car,
  branchId,
  onClose,
  onSubmit,
}) => {
  // Локальный стейт полей формы
  const [formData, setFormData] = useState<FormDataType>({
    firstName: "",
    lastName: "",
    contact: null,
    contactDetails: "",
    carId: car?.id,
    branchId: branchId,
  });
  // Наш хук из react-query, для создания заявки
  const { mutate: addApplication, isLoading } = useAddApplication();

  if (!isOpen || !car) return null;

  const handleChange = (key: keyof FormDataType, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addApplication(formData, {
      onSuccess: (newAppId) => {
        console.log("Заявка успешно создана:", newAppId);
        onSubmit?.(formData);

        onClose();
      },
      onError: (error) => {
        console.error("Ошибка при создании заявки:", error);
      },
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        <Text variant="blue">Укажите ваши данные для обратной связи!</Text>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <InputField
              type="text"
              value={formData.firstName}
              onChange={(val) => handleChange("firstName", val)}
              placeholder="Ваше имя"
            />
            <InputField
              type="text"
              value={formData.lastName}
              onChange={(val) => handleChange("lastName", val)}
              placeholder="Ваша фамилия"
            />
          </div>

          <Dropdown
            options={CONTACT_TYPE_OPTIONS}
            value={formData.contact}
            onChange={(val) => handleChange("contact", val)}
            placeholder="Выберите способ связи"
          />

          <div className={styles.infoContainer}>
            <InputField
              type="text"
              value={formData.contactDetails}
              onChange={(val) => handleChange("contactDetails", val)}
              placeholder="Введите контакт (телефон, email, ...)"
            />
          </div>

          <div className={styles.carPreview}>
            <CarDetailCard
              car={car}
              hideSubmitButton
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Отправка..." : "Отправить"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CarRequestModal;