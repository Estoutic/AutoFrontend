import React, { useState } from "react";
import Button from "@/shared/ui/Button/Button";
import { useGetAllReports, useDeleteReport } from "@/shared/api/report/hooks";
import { ReportDto, ReportFilterDto } from "@/shared/api/report/types";
import styles from "./AdminReportsPage.module.scss";
import { useMutation } from "react-query";
import { adminApi } from "@/shared/api/client";

// Type guard to check if object has content property that is an array
const isPaginatedResponse = (data: any): data is { content: ReportDto[] } => {
  return data && typeof data === 'object' && Array.isArray(data.content);
};

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

  // Get the reports array regardless of response format with proper type narrowing
  const getReports = (): ReportDto[] => {
    if (!data) {
      return [];
    }
    
    // Use type guard to safely access content property
    if (isPaginatedResponse(data)) {
      return data.content;
    }
    
    // Otherwise, if data is an array, return it
    if (Array.isArray(data)) {
      return data;
    }
    
    // Fallback to empty array
    return [];
  };

  const reports = getReports();

  // Mutation for deleting a report
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
          {reports.length > 0 ? (
            reports.map((report) => (
              <div key={report.id} className={styles.reportItem}>
                <div className={styles.reportInfo}>
                  <h3>{report.name}</h3>
                  <p>
                    <strong>Дата создания:</strong>{" "}
                    {report.createdAt
                      ? new Date(report.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <div className={styles.itemActions}>
                  <Button onClick={() => handleDownload(report.id)}>
                    Скачать
                  </Button>
                  <Button variant="secondary" onClick={() => handleDelete(report.id)}>
                    Удалить
                  </Button>
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