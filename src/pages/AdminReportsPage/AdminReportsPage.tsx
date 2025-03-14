import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Button from "@/shared/ui/Button/Button";
import { useGetAllReports, useDeleteReport } from "@/shared/api/report/hooks";
import { ReportFilterDto } from "@/shared/api/report/types";
import styles from "./AdminReportsPage.module.scss";
import { useMutation } from "react-query";
import { adminApi } from "@/shared/api/client";

const AdminReportsPage: React.FC = () => {
  
  const [filter, setFilter] = useState<ReportFilterDto>({});

  const handleCreatedAfterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilter((prev) => ({
      ...prev,
      createdAfter: value ? new Date(value).toISOString() : undefined,
    }));
  };

  const handleCreatedBeforeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilter((prev) => ({
      ...prev,
      createdBefore: value ? new Date(value).toISOString() : undefined,
    }));
  };

  const { data, isLoading, isError } = useGetAllReports(filter);

  // Мутация для удаления отчёта
  const deleteMutation = useDeleteReport();

  const downloadReportMutation = useMutation(async (id: string) => {
    const link = await adminApi.getReport(id);
    return link;
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Удалить отчёт?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          console.log("Отчёт удалён:", id);
        },
        onError: (err) => {
          alert("Ошибка удаления отчёта: " + err);
        },
      });
    }
  };

  const handleDownload = (id: string) => {
    downloadReportMutation.mutate(id, {
      onSuccess: (link) => {
        window.open(link, "_blank");
      },
      onError: (err) => {
        alert("Ошибка при получении ссылки для скачивания: " + err);
      },
    });
  };

  return (
    <div className={styles.container}>
      <h2>Отчёты</h2>
      <div className={styles.filter}>
        <div className={styles.field}>
          <label>Создан после:</label>
          <input type="date" onChange={handleCreatedAfterChange} />
        </div>
        <div className={styles.field}>
          <label>Создан до:</label>
          <input type="date" onChange={handleCreatedBeforeChange} />
        </div>
      </div>
      {isLoading ? (
        <div>Загрузка отчётов...</div>
      ) : isError ? (
        <div>Ошибка при загрузке отчётов</div>
      ) : (
        <div className={styles.reportsList}>
          {data && data.content && data.content.length > 0 ? (
            data.content.map((report) => (
              <div key={report.id} className={styles.reportItem}>
                <div className={styles.reportInfo}>
                  <h3>{report.name}</h3>
                  <p>
                    <strong>Дата создания:</strong>{" "}
                    {report.createdAt
                      ? new Date(report.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                  {/* <p>
                    <strong>Путь к файлу:</strong> {report.filePath}
                  </p> */}
                </div>
                <div className={styles.itemActions}>
                  <button onClick={() => handleDownload(report.id)}>
                    Скачать
                  </button>
                  <button  onClick={() => handleDelete(report.id)}>
                    Удалить
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>Отчёты отсутствуют</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminReportsPage;