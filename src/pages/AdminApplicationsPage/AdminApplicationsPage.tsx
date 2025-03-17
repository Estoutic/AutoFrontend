import React, { useState } from "react";
import Button from "@/shared/ui/Button/Button";
import {
  ApplicationDto,
  ApplicationStatus,
} from "@/shared/api/application/types";
import {
  useGetApplications,
  useDeleteApplication,
  useUpdateApplicationStatus,
} from "@/shared/api/application/hooks";
import styles from "./AdminApplicationsPage.module.scss";
import Dropdown from "@/shared/ui/Dropdown/Dropdown";

const AdminApplicationsPage: React.FC = () => {
  // Фильтр по статусу (опционально)
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "">("");

  const statusOptions = [
    { value: "", labelKey: "Все статусы" },
    { value: ApplicationStatus.IN_PROGRESS, labelKey: "В работе" },
    { value: ApplicationStatus.ACCEPTED, labelKey: "Принято" },
    { value: ApplicationStatus.REJECTED, labelKey: "Отклонено" },
    { value: ApplicationStatus.COMPLETED, labelKey: "Завершено" },
  ];

  const { data, isLoading, isError } = useGetApplications(
    statusFilter || undefined,
    0,
    10,
    "id",
    "asc",
    "EU",
  );

  const deleteMutation = useDeleteApplication();
  const updateStatusMutation = useUpdateApplicationStatus();

  const handleDelete = (id: string) => {
    if (window.confirm("Удалить заявку?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          console.log("Заявка удалена:", id);
        },
        onError: (err) => {
          alert("Ошибка удаления заявки: " + err);
        },
      });
    }
  };

  const handleUpdateStatus = (id: string, newStatus: ApplicationStatus) => {
    updateStatusMutation.mutate(
      { id, status: newStatus },
      {
        onSuccess: () => {
          console.log(`Статус заявки ${id} обновлён на ${newStatus}`);
        },
        onError: (err) => {
          alert("Ошибка обновления статуса заявки: " + err);
        },
      },
    );
  };

  if (isLoading) return <div>Загрузка заявок...</div>;
  if (isError) return <div>Ошибка при загрузке заявок</div>;

  // Предполагается, что data содержит объект с полем content — массив заявок
  const applications: ApplicationDto[] = data?.content || [];

  return (
    <div className={styles.container}>
      <h2>Управление заявками</h2>

      <div className={styles.filterRow}>
        <Dropdown
          options={statusOptions}
          value={statusFilter}
          onChange={(val) => setStatusFilter(val as ApplicationStatus | "")}
          placeholder="Фильтр по статусу"
        />
      </div>

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
                  <td>{app.contact}</td>
                  <td>{app.contactDetails}</td>
                  <td>
                    {app.firstName} {app.lastName}
                  </td>
                  <td>{app.status}</td>
                  <td>
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className={styles.actionsCell}>
                    <Button
                      onClick={() =>
                        handleUpdateStatus(app.id, ApplicationStatus.ACCEPTED)
                      }
                    >
                      Принять
                    </Button>
                    <Button
                      onClick={() =>
                        handleUpdateStatus(app.id, ApplicationStatus.REJECTED)
                      }
                    >
                      Отклонить
                    </Button>
                    <Button
                      onClick={() =>
                        handleUpdateStatus(app.id, ApplicationStatus.COMPLETED)
                      }
                    >
                      Завершить
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleDelete(app.id)}
                    >
                      Удалить
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>Заявки отсутствуют</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminApplicationsPage;
