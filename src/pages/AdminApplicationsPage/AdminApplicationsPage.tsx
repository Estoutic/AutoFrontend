import React, { useState, useEffect } from "react";
import Button from "@/shared/ui/Button/Button";
import {
  ApplicationDto,
  ApplicationStatus,
  ContactType
} from "@/shared/api/application/types";
import {
  useGetApplications,
  useDeleteApplication,
  useUpdateApplicationStatus,
} from "@/shared/api/application/hooks";
import styles from "./AdminApplicationsPage.module.scss";
import Dropdown from "@/shared/ui/Dropdown/Dropdown";
import InputField from "@/shared/ui/InputField/InputField";
import { useNotifications } from "@/shared/hooks/useNotifications";

const AdminApplicationsPage: React.FC = () => {
  const { showSuccess, showError, showInfo } = useNotifications();
  
  // State for filters
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "">("");
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [endDateFilter, setEndDateFilter] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);

  const statusOptions = [
    { value: "", labelKey: "Все статусы" },
    { value: ApplicationStatus.IN_PROGRESS, labelKey: "В работе" },
    { value: ApplicationStatus.ACCEPTED, labelKey: "Принято" },
    { value: ApplicationStatus.REJECTED, labelKey: "Отклонено" },
    { value: ApplicationStatus.COMPLETED, labelKey: "Завершено" },
  ];

  // Transform dates for API request
  const getFormattedDate = (dateString: string): string | undefined => {
    if (!dateString) return undefined;
    return new Date(dateString).toISOString();
  };

  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useGetApplications(
    statusFilter || undefined,
    page,
    pageSize,
    "createdAt", // Sort by creation date
    "desc", // Newest first
    "EU",
    getFormattedDate(startDateFilter),
    getFormattedDate(endDateFilter)
  );

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    }
  }, [data]);

  const deleteMutation = useDeleteApplication();
  const updateStatusMutation = useUpdateApplicationStatus();

  const handleDelete = (id: string, name: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        showSuccess(`Заявка от ${name} успешно удалена`, "Удаление заявки");
        refetch();
      },
      onError: (err) => {
        const errorMessage = err.response?.data || err.message || "Неизвестная ошибка";
        showError(`Ошибка удаления заявки: ${errorMessage}`, "Ошибка удаления");
      },
    });
  };

  const confirmDelete = (id: string, name: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить заявку от ${name}?`)) {
      handleDelete(id, name);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: ApplicationStatus, name: string) => {
    updateStatusMutation.mutate(
      { id, status: newStatus },
      {
        onSuccess: () => {
          showSuccess(
            `Статус заявки от ${name} обновлён на ${getStatusLabel(newStatus)}`, 
            "Обновление статуса"
          );
          refetch();
        },
        onError: (err) => {
          const errorMessage = err.response?.data || err.message || "Неизвестная ошибка";
          showError(`Ошибка обновления статуса заявки: ${errorMessage}`, "Ошибка обновления");
        },
      },
    );
  };

  const getStatusLabel = (status: ApplicationStatus): string => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.labelKey : status;
  };

  const getContactTypeLabel = (contactType: ContactType): string => {
    switch (contactType) {
      case ContactType.CALL:
        return "Телефон";
      case ContactType.EMAIL:
        return "Email";
      case ContactType.WHATSAPP:
        return "WhatsApp";
      case ContactType.TELEGRAM:
        return "Telegram";
      default:
        return contactType;
    }
  };

  const handleApplyFilters = () => {
    refetch();
    showInfo("Фильтры применены", "Фильтрация");
  };

  const handleResetFilters = () => {
    setStatusFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
    setPage(0);
    showInfo("Фильтры сброшены", "Фильтрация");
    refetch();
  };

  const handleNextPage = () => {
    if (page + 1 < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const renderStatusBadge = (status: ApplicationStatus) => {
    const statusClasses = {
      [ApplicationStatus.IN_PROGRESS]: styles.statusInProgress,
      [ApplicationStatus.ACCEPTED]: styles.statusAccepted,
      [ApplicationStatus.REJECTED]: styles.statusRejected,
      [ApplicationStatus.COMPLETED]: styles.statusCompleted,
    };

    return (
      <div className={`${styles.statusBadge} ${statusClasses[status] || ''}`}>
        {getStatusLabel(status)}
      </div>
    );
  };

  // Предполагается, что data содержит объект с полем content — массив заявок
  const applications: ApplicationDto[] = data?.content || [];

  return (
    <div className={styles.container}>
      <h2>Управление заявками</h2>

      <div className={styles.filtersContainer}>
        <div className={styles.filterRow}>
          <div className={styles.filterItem}>
            <label>Статус заявки</label>
            <Dropdown
              options={statusOptions}
              value={statusFilter}
              onChange={(val) => setStatusFilter(val as ApplicationStatus | "")}
              placeholder="Фильтр по статусу"
            />
          </div>
          
          <div className={styles.filterItem}>
            <label>Дата создания от</label>
            <InputField
              type="date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              placeholder="От"
            />
          </div>
          
          <div className={styles.filterItem}>
            <label>Дата создания до</label>
            <InputField
              type="date"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
              placeholder="До"
            />
          </div>
        </div>
        
        <div className={styles.filterActions}>
          <Button onClick={handleApplyFilters}>Применить фильтры</Button>
          <Button variant="secondary" onClick={handleResetFilters}>Сбросить</Button>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loadingState}>Загрузка заявок...</div>
      ) : isError ? (
        <div className={styles.errorState}>
          <p>Ошибка при загрузке заявок</p>
          <p className={styles.errorDetails}>
            {error instanceof Error ? error.message : "Неизвестная ошибка"}
          </p>
          <Button onClick={() => refetch()}>Попробовать снова</Button>
        </div>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.responsiveTable}>
              <thead>
                <tr>
                  <th>Способ связи</th>
                  <th>Контакты</th>
                  <th>ФИО</th>
                  <th>Статус</th>
                  <th>Дата создания</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={app.id}>
                      <td>{getContactTypeLabel(app.contact)}</td>
                      <td>{app.contactDetails}</td>
                      <td>
                        <div className={styles.nameCell}>
                          {app.firstName} {app.lastName}
                        </div>
                      </td>
                      <td>{renderStatusBadge(app.status)}</td>
                      <td>
                        {app.createdAt
                          ? new Date(app.createdAt).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className={styles.actionsCell}>
                        {app.status !== ApplicationStatus.ACCEPTED && (
                          <Button
                            className={styles.acceptButton}
                            onClick={() =>
                              handleUpdateStatus(app.id, ApplicationStatus.ACCEPTED, `${app.firstName} ${app.lastName}`)
                            }
                            disabled={updateStatusMutation.isLoading}
                          >
                            Принять
                          </Button>
                        )}
                        
                        {app.status !== ApplicationStatus.REJECTED && (
                          <Button
                            className={styles.rejectButton}
                            onClick={() =>
                              handleUpdateStatus(app.id, ApplicationStatus.REJECTED, `${app.firstName} ${app.lastName}`)
                            }
                            disabled={updateStatusMutation.isLoading}
                          >
                            Отклонить
                          </Button>
                        )}
                        
                        {app.status !== ApplicationStatus.COMPLETED && (
                          <Button
                            className={styles.completeButton}
                            onClick={() =>
                              handleUpdateStatus(app.id, ApplicationStatus.COMPLETED, `${app.firstName} ${app.lastName}`)
                            }
                            disabled={updateStatusMutation.isLoading}
                          >
                            Завершить
                          </Button>
                        )}
                        
                        <Button
                          variant="secondary"
                          className={styles.deleteButton}
                          onClick={() => confirmDelete(app.id, `${app.firstName} ${app.lastName}`)}
                          disabled={deleteMutation.isLoading}
                        >
                          Удалить
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className={styles.emptyState}>
                      <p>Заявки отсутствуют</p>
                      {(statusFilter || startDateFilter || endDateFilter) && (
                        <p className={styles.filterHint}>Попробуйте изменить параметры фильтрации</p>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {applications.length > 0 && (
            <div className={styles.pagination}>
              <div className={styles.paginationInfo}>
                Показано {applications.length} из {totalElements} заявок | Страница {page + 1} из {totalPages}
              </div>
              <div className={styles.paginationControls}>
                <Button
                  variant="secondary"
                  onClick={handlePreviousPage}
                  disabled={page === 0}
                >
                  Предыдущая
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleNextPage}
                  disabled={page + 1 >= totalPages}
                >
                  Следующая
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminApplicationsPage;