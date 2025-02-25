import React, { useState } from "react";
import styles from "./CarRequestModal.module.scss";
import { CarResponseDto } from "@/shared/api/car/types";
import Text from "@/shared/ui/Text/Text";
import InputField from "@/shared/ui/InputField/InputField";
import Dropdown from "@/shared/ui/Dropdown/Dropdown";
import Button from "@/shared/ui/Button/Button";
import CarDetailCard from "@/entities/CarDetailCard/CarDetailCard";

// Подгоняем по вашей enum ContactType (CALL, EMAIL, WHATSAPP, TELEGRAM).
// Чтобы Drodown мог подхватить, делаем массив опций:
const CONTACT_TYPE_OPTIONS = [
  { value: "CALL", labelKey: "Звонок" },
  { value: "EMAIL", labelKey: "Email" },
  { value: "WHATSAPP", labelKey: "WhatsApp" },
  { value: "TELEGRAM", labelKey: "Telegram" },
];

interface CarRequestModalProps {
  isOpen: boolean;
  car: CarResponseDto | null;
  branchId?: string;
  onClose: () => void;
  onSubmit?: (data: FormDataType) => void;
}

interface FormDataType {
  firstName: string;
  lastName: string;
  contact: string;
  contactDetails: string;
  carId?: string;
  branchId?: string;
}

const CarRequestModal: React.FC<CarRequestModalProps> = ({
  isOpen,
  car,
  branchId,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<FormDataType>({
    firstName: "",
    lastName: "",
    contact: "",
    contactDetails: "",
    carId: car?.id,
    branchId: branchId,
  });

  if (!isOpen || !car) return null;

  const handleChange = (key: keyof FormDataType, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit?.(formData);

    onClose();
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
              hideSubmitButton={true}
              car={car}
              onSubmit={() => {}} // пустая, чтобы не всплывало второе окно :)
            />
          </div>

          <Button type="submit">Отправить</Button>
        </form>
      </div>
    </div>
  );
};

export default CarRequestModal;
