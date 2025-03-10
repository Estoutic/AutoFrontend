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
const localeOptions = [
    { value: Locale.RU, labelKey: "RU" },
    { value: Locale.EN, labelKey: "EN" },
    { value: Locale.ZH, labelKey: "ZH" },
  ];
  
  const AdminCarTranslationsPage: React.FC = () => {
    const { carId } = useParams<{ carId: string }>();
    if (!carId) {
      return <div>carId не задан</div>;
    }
  
    const {
      data: originalCarData,
      isLoading: isCarLoading,
      isError: isCarError,
    } = useGetCarById(carId);
  
    const { data: translations, isLoading, isError } = useGetCarTranslations(carId);
    const createMutation = useCreateCarTranslation();
    const updateMutation = useUpdateCarTranslation();
    const deleteMutation = useDeleteCarTranslation();
  
    const { control, handleSubmit, reset, watch } = useForm<CarTranslationDto>({
      defaultValues: {
        locale: Locale.RU,
        color: "",
        description: "",
        mileage: undefined,
        price: undefined,
      },
    });
    const isEditMode = Boolean(watch("id"));
  
    // При сабмите создаём или обновляем перевод
    const onSubmit: SubmitHandler<CarTranslationDto> = (formData) => {
      formData.carId = carId;
      if (formData.id) {
        // Режим обновления
        updateMutation.mutate(
          { id: formData.id, dto: formData },
          {
            onSuccess: () => {
              console.log("Перевод обновлён");
              reset();
            },
            onError: (err) => {
              alert("Ошибка обновления перевода: " + err);
            },
          },
        );
      } else {
        createMutation.mutate(formData, {
          onSuccess: (newId) => {
            console.log("Создан перевод с id =", newId);
            reset();
          },
          onError: (err) => {
            alert("Ошибка создания перевода: " + err);
          },
        });
      }
    };
  
    const handleEdit = (translation: CarTranslationDto) => {
      reset(translation);
    };
  
    const handleDelete = (id: string) => {
      if (window.confirm("Удалить перевод?")) {
        deleteMutation.mutate(
          { id, carId },
          {
            onSuccess: () => {
              console.log("Перевод удалён:", id);
              if (watch("id") === id) {
                reset();
              }
            },
            onError: (err) => {
              alert("Ошибка удаления перевода: " + err);
            },
          },
        );
      }
    };
  
    if (isCarLoading) return <div>Загрузка данных автомобиля...</div>;
    if (isCarError) return <div>Ошибка при загрузке данных автомобиля</div>;
  
    return (
      <div className={styles.pageContainer}>
        <h2>Управление локализациями для автомобиля {carId}</h2>
  
        <div className={styles.layout}>
          <div className={styles.originalData}>
            <h3>Оригинальные данные</h3>
            {originalCarData ? (
              <div className={styles.originalFields}>
                <p><strong>Color:</strong> {originalCarData.color}</p>
                <p><strong>Description:</strong> {originalCarData.description}</p>
                <p><strong>Mileage:</strong> {originalCarData.mileage}</p>
                <p><strong>Price:</strong> {originalCarData.price}</p>
              </div>
            ) : (
              <div>Данные отсутствуют</div>
            )}
          </div>
  
          <div className={styles.translationsWrapper}>
            {isLoading ? (
              <div>Загрузка переводов...</div>
            ) : isError ? (
              <div>Ошибка при загрузке переводов</div>
            ) : (
              <div className={styles.translationsList}>
                {translations && translations.length > 0 ? (
                  translations.map((tr) => (
                    <div key={tr.id} className={styles.translationItem}>
                      <div>
                        <strong>{tr.locale}</strong> — {tr.color} / {tr.description} /{" "}
                        {tr.mileage} / {tr.price}
                      </div>
                      <div className={styles.itemActions}>
                        <Button onClick={() => handleEdit(tr)}>Редактировать</Button>
                        <Button variant="secondary" onClick={() => handleDelete(tr.id!)}>
                          Удалить
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>Переводы отсутствуют</div>
                )}
              </div>
            )}
  
            <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
              <h3>{isEditMode ? "Редактировать перевод" : "Создать перевод"}</h3>
              <div className={styles.fieldGroup}>
                <label>Locale</label>
                <Controller
                  name="locale"
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      options={localeOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Выберите язык"
                    />
                  )}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Цвет</label>
                <Controller
                  name="color"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      type="text"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Цвет"
                    />
                  )}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Описание</label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      type="text"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Описание"
                    />
                  )}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Пробег</label>
                <Controller
                  name="mileage"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      type="number"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Пробег"
                    />
                  )}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Цена</label>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      type="number"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Цена"
                    />
                  )}
                />
              </div>
              <div className={styles.formActions}>
                <Button type="submit">{isEditMode ? "Сохранить" : "Создать"}</Button>
                <Button type="button" variant="secondary" onClick={() => reset()}>
                  Сброс
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  export default AdminCarTranslationsPage;