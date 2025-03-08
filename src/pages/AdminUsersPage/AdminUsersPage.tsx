import React, { useState } from "react";
import { useGetAllUsers, useDeactivateUser, useCreateUser } from "../../shared/api/admin/hooks";
import { UserDto } from "@/shared/api/auth/types";
import styles from "./AdminUsersPage.module.scss";

// Функции для декодирования JWT (описаны выше)
function parseJwt(token: string): any {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (e) {
    console.error("Ошибка декодирования JWT:", e);
    return null;
  }
}

function getUserRoles(): string[] {
  const token = localStorage.getItem("accessToken");
  if (!token) return [];
  const decoded = parseJwt(token);
  if (!decoded || !decoded.roles) return [];
  return decoded.roles.split(",");
}

export const AdminUsersPage: React.FC = () => {
  // Получаем роли текущего пользователя
  const roles = getUserRoles();
  const canCreate = roles.includes("SUPERADMIN");
  const canDeactivate = roles.includes("ADMIN") || roles.includes("SUPERADMIN");
  const canView = roles.includes("MANAGER") || roles.includes("ADMIN") || roles.includes("SUPERADMIN");

  // Если пользователь вообще не имеет роли (MANAGER, ADMIN, SUPERADMIN), 
  // то он не может просматривать страницу
  // Можно сделать редирект или отображение сообщения
  if (!canView) {
    return <div>У вас нет прав для просмотра этой страницы</div>;
  }

  // Хуки
  const { data: users, isLoading, error } = useGetAllUsers();
  const { mutate: deactivateUser } = useDeactivateUser();
  const { mutate: createUser } = useCreateUser();

  // Состояние выбранного пользователя
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

  // Состояние формы для создания пользователя
  const [showForm, setShowForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("ADMIN"); // роль по умолчанию

  // Обработчик создания пользователя (только SUPERADMIN)
  const handleCreateUser = () => {
    if (!newEmail.trim() || !newPassword.trim()) {
      alert("Введите Email и Password!");
      return;
    }
    const userDto: UserDto = {
      email: newEmail,
      password: newPassword,
      roles: [newRole], // массив ролей
    };
    createUser(userDto, {
      onSuccess: (id) => {
        console.log("Пользователь создан:", id);
        setNewEmail("");
        setNewPassword("");
        setNewRole("ADMIN");
        setShowForm(false);
      },
      onError: (err) => {
        console.error("Ошибка создания пользователя:", err);
      },
    });
  };

  // Обработчик деактивации (ADMIN и SUPERADMIN)
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
        console.error("Ошибка при деактивации:", err);
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
          {users?.map((user) => (
            <tr key={user.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUser?.id === user.id}
                  onChange={() => {
                    if (selectedUser?.id === user.id) {
                      setSelectedUser(null);
                    } else {
                      setSelectedUser(user);
                    }
                  }}
                />
              </td>
              <td> {user.email}</td>
              <td>{user.roles?.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.actionButtons}>
        <button
          disabled={!canDeactivate || !selectedUser}
          onClick={handleDeactivateUser}
        >
          Деактивировать
        </button>
        <button
          disabled={!canDeactivate || !selectedUser}
          onClick={handleDeactivateUser}
        >
          Удалить
        </button>
        {canCreate && (
          <button onClick={() => setShowForm(true)}>
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
              <option value="SUPERADMIN">SUPERADMIN</option>
            </select>
          </div>
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