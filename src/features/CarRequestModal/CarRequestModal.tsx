import React, { useEffect, useState } from "react";
import styles from "./CarRequestModal.module.scss";
import { CarResponseDto } from "@/shared/api/car/types";
import Text from "@/shared/ui/Text/Text";
import InputField from "@/shared/ui/InputField/InputField";
import Dropdown from "@/shared/ui/Dropdown/Dropdown";
import Button from "@/shared/ui/Button/Button";
import CarDetailCard from "@/entities/CarDetailCard/CarDetailCard";
import { useAddApplication } from "@/shared/api/application/hooks";
import {
  ApplicationCreationDto,
  ContactType,
} from "@/shared/api/application/types";

const CONTACT_TYPE_OPTIONS = [
  { value: "CALL", labelKey: "Звонок" },
  { value: "EMAIL", labelKey: "Email" },
  { value: "WHATSAPP", labelKey: "WhatsApp" },
  { value: "TELEGRAM", labelKey: "Telegram" },
];

interface CarRequestModalProps {
  isOpen: boolean;
  car: CarResponseDto | null;
  onClose: () => void;
  onSubmit?: (data: ApplicationCreationDto) => void;
}

interface FormDataType extends ApplicationCreationDto {}

const CarRequestModal: React.FC<CarRequestModalProps> = ({
  isOpen,
  car,
  onClose,
  onSubmit,
}) => {
  const [viewMode, setViewMode] = useState<"form" | "success">("form");
  const [formData, setFormData] = useState<ApplicationCreationDto>({
    firstName: "",
    lastName: "",
    contact: "",
    contactDetails: "",
    carId: car?.id,
  });

  const { mutate: addApplication, isLoading } = useAddApplication();

  useEffect(() => {
    if (isOpen) {
      setViewMode("form");
    }
  }, [isOpen]);
  if (!isOpen || !car) return null;

  const handleChange = (key: keyof ApplicationCreationDto, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addApplication(
      { ...formData, carId: car.id },
      {
        onSuccess: (newId) => {
          console.log("Заявка создана:", newId);
          setViewMode("success");
        },
        onError: (err) => {
          console.log("Ошибка:", err);
        },
      },
    );
  };

  const handleReturnToCatalog = () => {
    onClose();
  };
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        {viewMode === "form" ? (
          <>
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
                <CarDetailCard car={car} hideSubmitButton />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Отправка..." : "Отправить"}
              </Button>
            </form>
          </>
        ) : (
          <div className={styles.successContainer}>
            <div className={styles.thanksContainer}>
              <h3>Спасибо,</h3>
              <h3>мы с вами свяжемся в ближайшее время!</h3>
            </div>

            <div className={styles.carModalPreview}>
              <CarDetailCard car={car} hideSubmitButton />
            </div>

            <div className={styles.actions}>
              <Button onClick={handleReturnToCatalog}>
                Вернуться к каталогу
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarRequestModal;
