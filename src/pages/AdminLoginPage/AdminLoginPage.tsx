import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Button from "@/shared/ui/Button/Button";
import styles from "./AdminLoginPage.module.scss";
import { useAuthUser } from "@/shared/api/auth/hooks";
import { UserDto } from "@/shared/api/auth/types";

type FormData = {
  email: string;
  password: string;
};

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: authUser, isLoading } = useAuthUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const userData: UserDto = {
      email: data.email,
      password: data.password,
    };

    authUser(userData, {
      onSuccess: () => {
        navigate("/admin");
      },
      onError: (error) => {
        console.log("Ошибка при авторизации:", error);
      },
    });
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Вход</h2>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="Email"
            {...register("email", { required: "Введите email" })}
          />
          {errors.email && (
            <span className={styles.errorMessage}>{errors.email.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Введите пароль",
            })}
          />
          {errors.password && (
            <span className={styles.errorMessage}>
              {errors.password.message}
            </span>
          )}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Входим..." : "Войти"}
        </Button>
      </form>
    </div>
  );
};
