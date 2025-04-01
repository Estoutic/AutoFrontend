import React, { useState } from "react";
import Button from "@/shared/ui/Button/Button";
import { useGetAllReports, useDeleteReport } from "@/shared/api/report/hooks";
import { ReportDto, ReportFilterDto } from "@/shared/api/report/types";
import styles from "./AdminReportsPage.module.scss";
import { useMutation } from "react-query";
import { adminApi } from "@/shared/api/client";
import { useNotifications } from "@/shared/hooks/useNotifications";

const isPaginatedResponse = (data: any): data is { content: ReportDto[] } => {
  return data && typeof data === 'object' && Array.isArray(data.content);
};

const AdminReportsPage: React.FC = () => {
  const { showSuccess, showError, showInfo } = useNotifications();
  const [filter, setFilter] = useState<ReportFilterDto>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  const { data, isLoading, isError, error, refetch } = useGetAllReports(filter);

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

  const downloadReportMutation = useMutation(
    async (id: string) => {
      setIsSubmitting(true);
      try {
        const link = await adminApi.getReport(id);
        return link;
      } finally {
        setIsSubmitting(false);
      }
    },
    {
      onError: (error: any) => {
        setIsSubmitting(false);
      }
    }
  );

  const handleDelete = (id: string, reportName: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        console.log("Отчёт удалён:", id);
        showSuccess(`Отчёт "${reportName}" успешно удален`, "Удаление отчёта");
        refetch(); // Refresh the report list
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || err.message || "Неизвестная ошибка";
        console.error("Ошибка удаления отчёта:", err);
        showError(`Ошибка при удалении отчёта: ${errorMessage}`, "Ошибка удаления");
      },
    });
  };

  const confirmDelete = (id: string, reportName: string) => {
    // Using the custom confirm dialog approach with notifications
    if (window.confirm(`Вы уверены, что хотите удалить отчёт "${reportName}"?`)) {
      handleDelete(id, reportName);
    }
  };

  const handleDownload = (id: string, reportName: string) => {
    if (isSubmitting) {
      showInfo("Пожалуйста, подождите, загрузка выполняется...");
      return;
    }

    downloadReportMutation.mutate(id, {
      onSuccess: (link) => {
        if (link) {
          // Create a direct download instead of opening in a new tab
          const a = document.createElement('a');
          a.href = link;
          a.download = reportName || `report-${id}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          showSuccess(`Скачивание отчёта "${reportName}" началось`, "Скачивание отчёта");
        } else {
          showError("Не удалось получить ссылку для скачивания", "Ошибка скачивания");
        }
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || err.message || "Неизвестная ошибка";
        console.error("Ошибка при получении ссылки для скачивания:", err);
        showError(`Ошибка при скачивании отчёта: ${errorMessage}`, "Ошибка скачивания");
      },
    });
  };

  const handleApplyFilter = () => {
    showInfo("Применяем фильтры...", "Фильтрация");
    refetch();
  };

  const handleResetFilter = () => {
    setFilter({});
    showInfo("Фильтры сброшены", "Фильтрация");
    // Find and reset date input elements
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach((input: Element) => {
      if (input instanceof HTMLInputElement) {
        input.value = "";
      }
    });
    refetch();
  };

  return (
    <div className={styles.container}>
      <h2>Отчёты</h2>
      <div className={styles.filter}>
        <div className={styles.field}>
          <label>Создан после:</label>
          <input 
            type="date" 
            onChange={handleCreatedAfterChange} 
          />
        </div>
        <div className={styles.field}>
          <label>Создан до:</label>
          <input 
            type="date" 
            onChange={handleCreatedBeforeChange} 
          />
        </div>
        <div className={styles.filterActions}>
          <Button onClick={handleApplyFilter}>Применить</Button>
          <Button variant="secondary" onClick={handleResetFilter}>Сбросить</Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className={styles.loadingState}>Загрузка отчётов...</div>
      ) : isError ? (
        <div className={styles.errorState}>
          <p>Ошибка при загрузке отчётов</p>
          <Button onClick={() => refetch()}>Попробовать снова</Button>
        </div>
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
                  <Button 
                    onClick={() => handleDownload(report.id, report.name)}
                    disabled={downloadReportMutation.isLoading && downloadReportMutation.variables === report.id}
                  >
                    {downloadReportMutation.isLoading && downloadReportMutation.variables === report.id
                      ? "Загружается..."
                      : "Скачать"
                    }
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>Отчёты отсутствуют</p>
              {Object.keys(filter).length > 0 && (
                <p className={styles.filterHint}>Попробуйте изменить параметры фильтрации</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminReportsPage;