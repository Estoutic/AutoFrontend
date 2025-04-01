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
import { metricsMock, METRIC_EVENTS, METRIC_GOALS } from "@/utils/metricsMock";

// Пытаемся импортировать настоящий хук метрики, но не вызываем его здесь
let useMetrika: any;
try {
  // Динамический импорт вызовет ошибку, но не завершит работу компонента
  import('@/features/YandexMetrika/YandexMetrikaProvider')
    .then(module => {
      useMetrika = module.useMetrika;
    })
    .catch(() => {
      console.warn('Модуль Яндекс.Метрики не загружен');
    });
} catch (e) {
  console.warn('Ошибка при импорте модуля метрики');
}

const CONTACT_TYPE_OPTIONS = [
  { value: "CALL", labelKey: "carRequestModal.contactType.call" },
  { value: "EMAIL", labelKey: "carRequestModal.contactType.email" },
  { value: "WHATSAPP", labelKey: "carRequestModal.contactType.whatsapp" },
  { value: "TELEGRAM", labelKey: "carRequestModal.contactType.telegram" },
];

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
  
  // Метрика: пытаемся использовать настоящую, с fallback на заглушку
  let metrics = metricsMock;
  try {
    if (typeof useMetrika === 'function') {
      metrics = useMetrika() || metricsMock;
    }
  } catch (e) {
    console.warn('Ошибка при использовании метрики, используется заглушка');
  }
  
  const { sendGoal, sendEvent } = metrics;
  
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
      
      // Отправляем событие открытия формы
      if (car) {
        sendEvent(METRIC_EVENTS.FORM_OPEN, {
          formType: 'car_request',
          carId: car.id,
          carName: car.name,
          carPrice: car.price
        });
      }
    }
  }, [isOpen, car, sendEvent]);

  if (!isOpen || !car) return null;

  // Handle input changes from InputField components
  const handleInputChange = (key: keyof ApplicationCreationDto) => (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [key]: event.target.value }));
    
    // Отслеживаем заполнение полей
    sendEvent(METRIC_EVENTS.FORM_FIELD_FILLED, { 
      fieldName: key,
      carId: car.id
    });
  };

  // Handle direct string value from Dropdown component
  const handleDropdownChange = (value: string) => {
    setFormData((prev) => ({ ...prev, contact: value }));
    
    // Отслеживаем выбор типа контакта
    sendEvent(METRIC_EVENTS.FORM_FIELD_FILLED, { 
      fieldName: 'contact',
      contactType: value,
      carId: car.id
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addApplication(
      { ...formData, carId: car.id },
      {
        onSuccess: (newId) => {
          console.log(t("carRequestModal.applicationCreated"), newId);
          setViewMode("success");
          
          // Отправляем цель успешной отправки формы
          sendGoal(METRIC_GOALS.CAR_REQUEST_SUBMITTED, {
            carId: car.id,
            carName: car.name,
            carPrice: car.price,
            applicationId: newId,
            contactType: formData.contact
          });
        },
        onError: (err) => {
          console.log(t("carRequestModal.error"), err);
          
          // Отслеживаем ошибки отправки
          sendEvent(METRIC_EVENTS.FORM_SUBMIT, {
            status: 'error',
            carId: car.id,
            errorMessage: String(err)
          });
        },
      },
    );
  };

  const handleReturnToCatalog = () => {
    onClose();
    
    // Отслеживаем возврат в каталог
    sendEvent(METRIC_EVENTS.BUTTON_CLICK, {
      buttonType: 'return_to_catalog',
      fromSuccessScreen: viewMode === 'success',
      carId: car.id
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>

        {viewMode === "form" ? (
          <>
            <Button className={styles.closeButton} variant="secondary" onClick={() => {
              onClose();
              // Отслеживаем закрытие формы
              sendEvent(METRIC_EVENTS.FORM_CLOSE, {
                stage: 'form',
                carId: car.id
              });
            }}>
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

              <Button 
                type="submit" 
                disabled={isLoading}
                onClick={() => {
                  // Отслеживаем клик по кнопке отправки
                  sendEvent(METRIC_EVENTS.BUTTON_CLICK, {
                    buttonType: 'car_request_submit',
                    carId: car.id,
                    formComplete: Boolean(formData.firstName && formData.lastName && 
                                          formData.contact && formData.contactDetails)
                  });
                }}
              >
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