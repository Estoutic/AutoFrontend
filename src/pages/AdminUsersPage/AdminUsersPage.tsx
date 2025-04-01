import React, { useState } from "react";
import { UserDto } from "@/shared/api/auth/types";
import styles from "./AdminUsersPage.module.scss";
import {
  haveSuperAdminRights,
  haveAdminRights,
  haveManagerRights,
} from "@/utils/authUtils";
import {
  useCreateUser,
  useDeactivateUser,
  useGetAllUsers,
} from "@/shared/api/admin/hooks";
import Button from "@/shared/ui/Button/Button";
import { useNotifications } from "@/shared/hooks/useNotifications";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AdminUsersPage: React.FC = () => {
  const { showSuccess, showError } = useNotifications();
  const canCreate = haveSuperAdminRights();
  const canDeactivate = haveAdminRights();
  const canView = haveManagerRights();

  if (!canView) {
    return <div>У вас нет прав для просмотра этой страницы</div>;
  }

  const { data: users, isLoading, error } = useGetAllUsers();

  const filteredUsers = users?.filter(function (user) {
    return !user.roles?.includes("SUPERADMIN") && user.isActive;
  });

  const { mutate: createUser } = useCreateUser();
  const { mutate: deactivateUser } = useDeactivateUser();

  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("ADMIN");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [backendError, setBackendError] = useState("");

  const handleCreateUser = () => {
    // Reset all error states
    setEmailError("");
    setPasswordError("");
    setBackendError("");

    // Validate form fields
    let hasError = false;

    if (!newEmail.trim()) {
      setEmailError("Email обязателен");
      hasError = true;
    } else if (!emailRegex.test(newEmail)) {
      setEmailError("Введите корректный Email");
      hasError = true;
    }

    if (!newPassword.trim()) {
      setPasswordError("Пароль обязателен");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const userDto: UserDto = {
      email: newEmail,
      password: newPassword,
      roles: [newRole],
    };

    createUser(userDto, {
      onSuccess: (id) => {
        console.log("Пользователь создан, ID =", id);
        showSuccess(`Пользователь ${newEmail} успешно создан`, "Новый пользователь");
        setNewEmail("");
        setNewPassword("");
        setNewRole("ADMIN");
        setShowForm(false);
      },
      onError: (err: any) => {
        console.error("Ошибка создания пользователя:", err);
        const errorMessage = err.response?.data?.message || "Неизвестная ошибка";
        setBackendError(errorMessage);
        showError(`Ошибка при создании пользователя: ${errorMessage}`);
      },
    });
  };

  const handleDeactivateUser = () => {
    if (!selectedUser) {
      showError("Сначала выберите пользователя");
      return;
    }
    if (!selectedUser.id) {
      console.error("У выбранного пользователя нет id!");
      showError("У выбранного пользователя отсутствует ID");
      return;
    }
    deactivateUser(selectedUser.id, {
      onSuccess: () => {
        console.log("Пользователь деактивирован:", selectedUser.id);
        showSuccess(`Пользователь ${selectedUser.email} деактивирован`, "Деактивация пользователя");
        setSelectedUser(null);
      },
      onError: (err: any) => {
        console.error("Ошибка при деактивации пользователя:", err);
        const errorMessage = err.response?.data?.message || "Неизвестная ошибка";
        showError(`Ошибка при деактивации пользователя: ${errorMessage}`);
      },
    });
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки пользователей</div>;

  return (
    <div className={styles.container}>
      <h2>Список сотрудников</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Roles</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers?.map((user) => (
            <tr key={user.id}>
              <td>
                <div className={styles.emailContainer}>
                  {user.email}
                  <label className={styles.customCheckbox}>
                    <input
                      type="checkbox"
                      checked={selectedUser?.id === user.id}
                      onChange={() =>
                        setSelectedUser(
                          selectedUser?.id === user.id ? null : user,
                        )
                      }
                    />
                    <span className={styles.checkmark}></span>
                  </label>
                </div>
              </td>
              <td>{user.roles?.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.actionButtons}>
        {canDeactivate && (
          <Button
            variant="secondary"
            className={styles.deactivateButton}
            disabled={!selectedUser}
            onClick={handleDeactivateUser}
          >
            Деактивировать
          </Button>
        )}
        {canCreate && (
          <Button
            className={styles.addButton}
            onClick={() => setShowForm(true)}
          >
            Добавить
          </Button>
        )}
      </div>

      {showForm && canCreate && (
        <div className={styles.formContainer}>
          <h3>Добавить пользователя</h3>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className={emailError ? styles.inputError : ""}
            />
          </div>
          {emailError && (
            <div className={styles.errorText}>{emailError}</div>
          )}
          
          <div className={styles.formGroup}>
            <input
              type="password"
              placeholder="Пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={passwordError ? styles.inputError : ""}
            />
          </div>
          {passwordError && (
            <div className={styles.errorText}>{passwordError}</div>
          )}
          
          <div className={styles.formGroup}>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="MANAGER">MANAGER</option>
            </select>
          </div>
          
          {backendError && (
            <div className={styles.backendError}>{backendError}</div>
          )}
          
          <div className={styles.formActions}>
            <Button onClick={handleCreateUser}>Создать</Button>
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowForm(false);
                setEmailError("");
                setPasswordError("");
                setBackendError("");
                setNewEmail("");
                setNewPassword("");
                setNewRole("ADMIN");
              }}
            >
              Отмена
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;