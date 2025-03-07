import { CarModelDto } from "@/shared/api/car/types";
import styles from "./CarModelForm.module.scss";
import React, { useState } from "react";

const CarModelForm: React.FC<{
  createForm: boolean;
  selectedModel?: CarModelDto;
  onSave: (dto: CarModelDto) => void;
  onCancel: () => void;
}> = ({ createForm, selectedModel, onSave, onCancel }) => {
  const [brand, setBrand] = useState(selectedModel?.brand || "");
  const [model, setModel] = useState(selectedModel?.model || "");
  const [generation, setGeneration] = useState(selectedModel?.generation || "");

  return (
    <div className={styles.formContainer}>
      <h3>{createForm ? "Добавить модель" : "Обновить модель"}</h3>
      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder="Марка"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder="Модель"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder="Поколение"
          value={generation}
          onChange={(e) => setGeneration(e.target.value)}
        />
      </div>
      <div className={styles.formActions}>
        <button onClick={() => onSave({ brand, model, generation })}>
          {createForm ? "Создать" : "Обновить"}
        </button>
        <button onClick={onCancel}>Отмена</button>
      </div>
    </div>
  );
};

export default CarModelForm;
