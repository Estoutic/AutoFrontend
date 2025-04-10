import React, { useEffect, useState, ChangeEvent } from "react";
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
import { useTranslation } from "react-i18next";



interface CarRequestModalProps {
  isOpen: boolean;
  car: CarResponseDto | null;
  onClose: () => void;
  onSubmit?: (data: ApplicationCreationDto) => void;
}

const CarRequestModal: React.FC<CarRequestModalProps> = ({
  isOpen,
  car,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();

  const CONTACT_TYPE_OPTIONS = [
    { value: "CALL", labelKey: "carRequestModal.contactType.call" },
    { value: "EMAIL", labelKey: "carRequestModal.contactType.email" },
    { value: "WHATSAPP", labelKey: "carRequestModal.contactType.whatsapp" },
    { value: "TELEGRAM", labelKey: "carRequestModal.contactType.telegram" },
  ];
  
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

  // Handle input changes from InputField components (which use event objects)
  const handleInputChange = (key: keyof ApplicationCreationDto) => (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [key]: event.target.value }));
  };

  // Handle direct string value from Dropdown component
  const handleDropdownChange = (value: string) => {
    setFormData((prev) => ({ ...prev, contact: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addApplication(
      { ...formData, carId: car.id },
      {
        onSuccess: (newId) => {
          console.log(t("carRequestModal.applicationCreated"), newId);
          setViewMode("success");
        },
        onError: (err) => {
          console.log(t("carRequestModal.error"), err);
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

        {viewMode === "form" ? (
          <>
                  <Button className={styles.closeButton} variant="secondary" onClick={onClose}>
          ✕
        </Button>
            <Text variant="blue">
              {t("carRequestModal.enterYourData")}
            </Text>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.row}>
                <InputField
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange("firstName")}
                  placeholder={t("carRequestModal.firstNamePlaceholder")}
                />
                <InputField
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange("lastName")}
                  placeholder={t("carRequestModal.lastNamePlaceholder")}
                />
              </div>

              <Dropdown
                options={CONTACT_TYPE_OPTIONS}
                value={formData.contact}
                onChange={handleDropdownChange}
                placeholder={t("carRequestModal.contactTypePlaceholder")}
              />

              <div className={styles.infoContainer}>
                <InputField
                  type="text"
                  value={formData.contactDetails}
                  onChange={handleInputChange("contactDetails")}
                  placeholder={t("carRequestModal.contactDetailsPlaceholder")}
                />
              </div>

              <div className={styles.carPreview}>
                <CarDetailCard car={car} hideSubmitButton />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? t("carRequestModal.sending")
                  : t("carRequestModal.submitButton")}
              </Button>
            </form>
          </>
        ) : (
          <div className={styles.successContainer}>
            <div className={styles.thanksContainer}>
              <h3>{t("carRequestModal.thankYou1")}</h3>
              <h3>{t("carRequestModal.thankYou2")}</h3>
            </div>

            <div className={styles.carModalPreview}>
              <CarDetailCard car={car} hideSubmitButton />
            </div>

            <div className={styles.actions}>
              <Button onClick={handleReturnToCatalog}>
                {t("carRequestModal.returnToCatalog")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarRequestModal;