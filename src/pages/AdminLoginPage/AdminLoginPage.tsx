import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Button from "@/shared/ui/Button/Button";
import styles from "./AdminLoginPage.module.scss";
import { useAuthUser } from "@/shared/api/auth/hooks";
import { UserDto } from "@/shared/api/auth/types";
import { useNotifications } from "@/shared/hooks/useNotifications";

type FormData = {
  email: string;
  password: string;
};

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useNotifications();
  const { mutate: authUser, isLoading } = useAuthUser();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    // Сбрасываем предыдущие ошибки

    setAuthError(null);
    showInfo("Выполняется вход...", "Авторизация");

    const userData: UserDto = {
      email: data.email,
      password: data.password,
    };

    authUser(userData, {
      onSuccess: () => {
        showSuccess("Вы успешно авторизованы!", "Успешный вход");
        navigate("/admin/cars");
      },
      onError: (error: any) => {
        // Получаем подробное сообщение об ошибке
        const errorMessage =
          error?.response?.data?.message || "Неверный логин или пароль";

        // Устанавливаем ошибку в состояние компонента
        setAuthError(errorMessage);

        // Показываем уведомление с ошибкой и задержкой для лучшего восприятия
        setTimeout(() => {
          showError(`Не удалось войти: ${errorMessage}`, "Ошибка авторизации");
        }, 300);

        console.error("Ошибка при авторизации:", error);

        // Не сбрасываем поля, оставляем их для исправления
      },
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <h2>Вход в панель администратора</h2>
            <p>Пожалуйста, введите свои данные для входа</p>
          </div>

          {authError && (
            <div className={styles.authErrorMessage}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{authError}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();  
              handleSubmit(onSubmit)(e);
            }}
            className={styles.loginForm}
          >
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <div className={styles.inputWrapper}>
                <input
                  id="email"
                  type="text"
                  placeholder="Введите ваш email"
                  className={errors.email || authError ? styles.inputError : ""}
                  {...register("email", {
                    required: "Введите email",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Введите корректный email",
                    },
                  })}
                />
                <div className={styles.inputIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
              </div>
              {errors.email && (
                <span className={styles.errorMessage}>
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Пароль</label>
              <div className={styles.inputWrapper}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Введите ваш пароль"
                  className={
                    errors.password || authError ? styles.inputError : ""
                  }
                  {...register("password", {
                    required: "Введите пароль",
                    // minLength: {
                    //   value: 6,
                    //   message: "Пароль должен содержать минимум 6 символов",
                    // },
                  })}
                />
                <div
                  className={`${styles.inputIcon} ${styles.passwordToggle}`}
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </div>
              </div>
              {errors.password && (
                <span className={styles.errorMessage}>
                  {errors.password.message}
                </span>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={styles.loginButton}
            >
              {isLoading ? (
                <div className={styles.loadingIndicator}>
                  <span className={styles.spinner}></span>
                  <span>Выполняется вход...</span>
                </div>
              ) : (
                "Войти"
              )}
            </Button>

            <div className={styles.forgotPassword}>
              Забыли пароль? Обратитесь к администратору
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
