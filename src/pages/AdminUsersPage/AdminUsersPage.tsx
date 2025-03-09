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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AdminUsersPage: React.FC = () => {
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
  const [backendError, setBackendError] = useState("");

  const handleCreateUser = () => {
    setEmailError("");
    setBackendError("");

    if (!newEmail.trim() || !newPassword.trim()) {
      setBackendError("Введите Email и Password!");
      return;
    }
    if (!emailRegex.test(newEmail)) {
      setEmailError("Введите корректный Email");
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
        setNewEmail("");
        setNewPassword("");
        setNewRole("ADMIN");
        setShowForm(false);
      },
      onError: (err: any) => {
        console.error("Ошибка создания пользователя:", err);
        setBackendError(
          "Ошибка при создании пользователя" + err.response.data.message,
        );
      },
    });
  };

  const handleDeactivateUser = () => {
    if (!selectedUser) {
      alert("Сначала выберите пользователя");
      return;
    }
    if (!selectedUser.id) {
      console.error("У выбранного пользователя нет id!");
      return;
    }
    deactivateUser(selectedUser.id, {
      onSuccess: () => {
        console.log("Пользователь деактивирован:", selectedUser.id);
        setSelectedUser(null);
      },
      onError: (err) => {
        console.error("Ошибка при деактивации пользователя:", err);
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
          <button
            className={styles.deactivateButton}
            disabled={!selectedUser}
            onClick={handleDeactivateUser}
          >
            Деактивировать
          </button>
        )}
        {canCreate && (
          <button
            className={styles.addButton}
            onClick={() => setShowForm(true)}
          >
            Добавить
          </button>
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
            />
            {emailError && (
              <span className={styles.errorMessage}>{emailError}</span>
            )}
          </div>
          <div className={styles.formGroup}>
            <input
              type="password"
              placeholder="Пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
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
            <div className={styles.errorMessage}>{backendError}</div>
          )}
          <div className={styles.formActions}>
            <button onClick={handleCreateUser}>Создать</button>
            <button onClick={() => setShowForm(false)}>Отмена</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
