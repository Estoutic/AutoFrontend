import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "@/shared/ui/Button/Button";
import {
  useCreateCarTranslation,
  useDeleteCarTranslation,
  useGetCarTranslations,
  useUpdateCarTranslation,
} from "@/shared/api/translations/hooks";
import { CarTranslationDto, Locale } from "@/shared/api/translations/types";
import styles from "./AdminCarTranslationsPage.module.scss";
import InputField from "@/shared/ui/InputField/InputField";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Dropdown from "@/shared/ui/Dropdown/Dropdown";
import { useGetCarById } from "@/shared/api/car/hooks";
import { useNotifications } from "@/shared/hooks/useNotifications";
import { 
  formatMileage, 
  formatPrice, 
  getDefaultCurrencyCode, 
  getLocaleDisplayName, 
  isLocaleUsingMiles 
} from "@/shared/api/translations/utils";
import InfoTooltip from "@/features/InfoToolTip/InfoToolTip";

const localeOptions = [
  { value: Locale.RU, labelKey: getLocaleDisplayName(Locale.RU) },
  { value: Locale.EU, labelKey: getLocaleDisplayName(Locale.EU) },
  { value: Locale.ZH, labelKey: getLocaleDisplayName(Locale.ZH) },
];

const AdminCarTranslationsPage: React.FC = () => {
  const { showSuccess, showError, showInfo } = useNotifications();
  const { carId } = useParams<{ carId: string }>();

  if (!carId) {
    return <div className={styles.errorMessage}>carId не задан</div>;
  }

  const {
    data: originalCarData,
    isLoading: isCarLoading,
    isError: isCarError,
    error: carError,
  } = useGetCarById(carId);

  const {
    data: translations,
    isLoading,
    isError,
    error: translationsError,
    refetch: refetchTranslations,
  } = useGetCarTranslations(carId);

  const createMutation = useCreateCarTranslation();
  const updateMutation = useUpdateCarTranslation();
  const deleteMutation = useDeleteCarTranslation();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<CarTranslationDto>({
    defaultValues: {
      id: undefined,
      locale: Locale.RU,
      color: "",
      description: "",
      mileage: undefined,
      price: undefined,
      currencyCode: "RUB",
      isMiles: false,
    },
  });

  const isEditMode = Boolean(watch("id"));
  const currentLocale = watch("locale");
  
  // Update currency code and miles flag when locale changes
  useEffect(() => {
    if (!isEditMode) {
      setValue("currencyCode", getDefaultCurrencyCode(currentLocale));
      setValue("isMiles", isLocaleUsingMiles(currentLocale));
    }
  }, [currentLocale, isEditMode, setValue]);

  // Validation for duplicate locale
  const isDuplicateLocale = (): boolean => {
    if (!translations || isEditMode) return false;

    return translations.some((t) => t.locale === currentLocale);
  };

  const onSubmit: SubmitHandler<CarTranslationDto> = (formData) => {
    // Check for duplicate locale when creating
    if (!isEditMode && isDuplicateLocale()) {
      showError(
        `Перевод для локали ${currentLocale} уже существует`,
        "Ошибка валидации",
      );
      return;
    }

    formData.carId = carId;

    if (formData.id) {
      updateMutation.mutate(
        { id: formData.id, dto: formData },
        {
          onSuccess: () => {
            showSuccess(
              `Перевод для локали ${formData.locale} успешно обновлен`,
              "Обновление перевода",
            );
            refetchTranslations();
            reset();
          },
          onError: (err: any) => {
            const errorMessage =
              err.response?.data?.message ||
              err.message ||
              "Неизвестная ошибка";
            showError(
              `Ошибка обновления перевода: ${errorMessage}`,
              "Ошибка обновления",
            );
          },
        },
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: (newId) => {
          showSuccess(
            `Перевод для локали ${formData.locale} успешно создан`,
            "Новый перевод",
          );
          refetchTranslations();
          reset();
        },
        onError: (err: any) => {
          const errorMessage =
            err.response?.data?.message || err.message || "Неизвестная ошибка";
          showError(
            `Ошибка создания перевода: ${errorMessage}`,
            "Ошибка создания",
          );
        },
      });
    }
  };

  const handleEdit = (translation: CarTranslationDto) => {
    reset(translation);
    showInfo(
      `Редактирование перевода для локали ${translation.locale}`,
      "Редактирование",
    );
  };

  const handleDelete = (id: string, locale: Locale) => {
    const selectedId = watch("id");

    deleteMutation.mutate(
      { id, carId },
      {
        onSuccess: () => {
          showSuccess(
            `Перевод для локали ${locale} успешно удален`,
            "Удаление перевода",
          );
          refetchTranslations();

          // Reset the form if we're currently editing the deleted translation
          if (selectedId === id) {
            reset({
              id: undefined,
              locale: Locale.RU,
              color: "",
              description: "",
              mileage: undefined,
              price: undefined,
              currencyCode: "RUB",
              isMiles: false,
            });
          }
        },
        onError: (err: any) => {
          const errorMessage =
            err.response?.data?.message || err.message || "Неизвестная ошибка";
          showError(
            `Ошибка удаления перевода: ${errorMessage}`,
            "Ошибка удаления",
          );
        },
      },
    );
  };

  const confirmDelete = (id: string, locale: Locale) => {
    if (
      window.confirm(
        `Вы уверены, что хотите удалить перевод для локали ${locale}?`,
      )
    ) {
      handleDelete(id, locale);
    }
  };

  const handleCancel = () => {
    if (
      isDirty &&
      window.confirm(
        "У вас есть несохраненные изменения. Вы уверены, что хотите сбросить форму?",
      )
    ) {
      reset();
      showInfo("Форма сброшена", "Редактирование отменено");
    } else if (!isDirty) {
      reset();
    }
  };

  if (isCarLoading)
    return (
      <div className={styles.loadingState}>Загрузка данных автомобиля...</div>
    );
  if (isCarError) {
    return (
      <div className={styles.errorState}>
        <p>Ошибка при загрузке данных автомобиля</p>
        <p className={styles.errorDetails}>
          {carError instanceof Error ? carError.message : "Неизвестная ошибка"}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>
        Управление локализациями для автомобиля {originalCarData?.name || carId}
      </h2>
      
      <div className={styles.infoBox}>
        <p>
          <strong>Информация о локализации:</strong> При выборе локали данные автоматически конвертируются:
        </p>
        <ul>
          <li>RU: Цена в рублях (₽), пробег в километрах (км)</li>
          <li>EU: Цена в долларах ($), пробег в милях (mi)</li>
          <li>ZH: Цена в юанях (¥), пробег в километрах (км)</li>
        </ul>
        <p>Конвертация происходит автоматически на сервере.</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.originalData}>
          <h3>Оригинальные данные</h3>
          {originalCarData ? (
            <div className={styles.originalFields}>
              <p>
                <strong>Color:</strong> {originalCarData.color}
              </p>
              <p>
                <strong>Description:</strong> {originalCarData.description}
              </p>
              <p>
                <strong>Mileage:</strong> {originalCarData.mileage} км
              </p>
              <p>
                <strong>Price:</strong> {originalCarData.price} ₽
              </p>
            </div>
          ) : (
            <div>Данные отсутствуют</div>
          )}
        </div>

        <div className={styles.translationsWrapper}>
          {isLoading ? (
            <div className={styles.loadingState}>Загрузка переводов...</div>
          ) : isError ? (
            <div className={styles.errorState}>
              <p>Ошибка при загрузке переводов</p>
              <p className={styles.errorDetails}>
                {translationsError instanceof Error
                  ? translationsError.message
                  : "Неизвестная ошибка"}
              </p>
              <Button onClick={() => refetchTranslations()}>
                Попробовать снова
              </Button>
            </div>
          ) : (
            <div className={styles.translationsList}>
              <h3>Существующие переводы</h3>
              {translations && translations.length > 0 ? (
                translations.map((tr) => (
                  <div
                    key={tr.id}
                    className={`${styles.translationItem} ${watch("id") === tr.id ? styles.activeItem : ""}`}
                  >
                    <div className={styles.translationDetails}>
                      <div className={styles.translationLocale}>
                        {tr.locale}
                        <div className={styles.localeMeta}>
                          {tr.currencyCode || getDefaultCurrencyCode(tr.locale)}, 
                          {tr.isMiles ? ' miles' : ' km'}
                        </div>
                      </div>
                      <div className={styles.translationData}>
                        <span>
                          <strong>Цвет:</strong> {tr.color}
                        </span>
                        <span>
                          <strong>Описание:</strong> {tr.description}
                        </span>
                        <span>
                          <strong>Пробег:</strong> {formatMileage(tr.mileage, tr.isMiles)}
                        </span>
                        <span>
                          <strong>Цена:</strong> {formatPrice(tr.price, tr.currencyCode)}
                        </span>
                      </div>
                    </div>
                    <div className={styles.itemActions}>
                      <Button
                        onClick={() => handleEdit(tr)}
                        disabled={
                          updateMutation.isLoading || createMutation.isLoading
                        }
                      >
                        Редактировать
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => confirmDelete(tr.id!, tr.locale)}
                        disabled={
                          deleteMutation.isLoading &&
                          deleteMutation.variables?.id === tr.id
                        }
                      >
                        {deleteMutation.isLoading &&
                        deleteMutation.variables?.id === tr.id
                          ? "Удаление..."
                          : "Удалить"}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <p>Переводы отсутствуют</p>
                  <p>Используйте форму ниже для добавления перевода</p>
                </div>
              )}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.formContainer}
          >
            <h3>{isEditMode ? "Редактировать перевод" : "Создать перевод"}</h3>
            <div className={styles.fieldGroup}>
              <label>
                Locale 
                <InfoTooltip content="При выборе локали автоматически определяется валюта и единица измерения пробега" />
              </label>
              <Controller
                name="locale"
                control={control}
                rules={{ required: "Locale обязателен" }}
                render={({ field, fieldState }) => (
                  <>
                    <Dropdown
                      options={localeOptions}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      placeholder="Выберите язык"
                      disabled={isEditMode}
                    />
                    {fieldState.error && (
                      <div className={styles.errorText}>
                        {fieldState.error.message}
                      </div>
                    )}
                  </>
                )}
              />
              {!isEditMode && isDuplicateLocale() && (
                <div className={styles.errorText}>
                  Перевод для этой локали уже существует
                </div>
              )}
              <div className={styles.fieldInfo}>
                {formatPrice(watch("price") || 0, watch("currencyCode") || getDefaultCurrencyCode(watch("locale")))} | 
                {formatMileage(watch("mileage") || 0, watch("isMiles") || isLocaleUsingMiles(watch("locale")))}
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label>Цвет</label>
              <Controller
                name="color"
                control={control}
                rules={{ required: "Цвет обязателен" }}
                render={({ field, fieldState }) => (
                  <>
                    <InputField
                      type="text"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Цвет"
                    />
                    {fieldState.error && (
                      <div className={styles.errorText}>
                        {fieldState.error.message}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Описание</label>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Описание обязательно" }}
                render={({ field, fieldState }) => (
                  <>
                    <InputField
                      type="text"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Описание"
                    />
                    {fieldState.error && (
                      <div className={styles.errorText}>
                        {fieldState.error.message}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>
                Пробег 
                <span className={styles.unitLabel}>
                  ({watch("isMiles") || isLocaleUsingMiles(watch("locale")) ? "miles" : "km"})
                </span>
              </label>
              <Controller
                name="mileage"
                control={control}
                rules={{
                  required: "Пробег обязателен",
                  min: {
                    value: 0,
                    message: "Пробег не может быть отрицательным",
                  },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <InputField
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value),
                        );
                      }}
                      placeholder="Пробег"
                    />
                    {fieldState.error && (
                      <div className={styles.errorText}>
                        {fieldState.error.message}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>
                Цена
                <span className={styles.unitLabel}>
                  ({watch("currencyCode") || getDefaultCurrencyCode(watch("locale"))})
                </span>
              </label>
              <Controller
                name="price"
                control={control}
                rules={{
                  required: "Цена обязательна",
                  min: {
                    value: 0,
                    message: "Цена не может быть отрицательной",
                  },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <InputField
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value),
                        );
                      }}
                      placeholder="Цена"
                    />
                    {fieldState.error && (
                      <div className={styles.errorText}>
                        {fieldState.error.message}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
            <div className={styles.formActions}>
              <Button
                type="submit"
                disabled={
                  createMutation.isLoading ||
                  updateMutation.isLoading ||
                  (!isEditMode && isDuplicateLocale())
                }
              >
                {createMutation.isLoading || updateMutation.isLoading
                  ? "Сохранение..."
                  : isEditMode
                    ? "Сохранить"
                    : "Создать"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={createMutation.isLoading || updateMutation.isLoading}
              >
                Отмена
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCarTranslationsPage;