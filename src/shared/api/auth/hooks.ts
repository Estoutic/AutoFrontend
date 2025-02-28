import { useMutation, useQueryClient, UseMutationResult } from "react-query";
import { AxiosError } from "axios";
import { AuthToken, RefreshTokenDto, UserDto } from "../auth/types";
import { userApi } from "../client";

/** Авторизация пользователя (POST /user/auth) */
export const useAuthUser = (): UseMutationResult<
  AuthToken,
  AxiosError,
  UserDto
> => {
  const queryClient = useQueryClient();

  const mutationFn = async (userDto: UserDto) => {
    const authToken = await userApi.authUser(userDto);
    return authToken;
  };

  return useMutation({
    mutationFn,
    onSuccess: (authToken) => {
      console.log("Пользователь авторизован, access token =", authToken.token);
      localStorage.setItem("accessToken", authToken.token);
      localStorage.setItem("refreshToken", authToken.refreshToken);
    },
  });
};

/** Обновление токена (POST /user/refresh-token) */
export const useRefreshToken = (): UseMutationResult<
  AuthToken,
  AxiosError,
  RefreshTokenDto
> => {
  const queryClient = useQueryClient();

  const mutationFn = async (refreshTokenDto: RefreshTokenDto) => {
    const authToken = await userApi.refreshToken(refreshTokenDto);
    return authToken;
  };

  return useMutation({
    mutationFn,
    onSuccess: (authToken, refreshTokenDto) => {
      console.log("Токен обновлён, новый access token =", authToken.token);
      localStorage.setItem("accessToken", authToken.token);
    },
    onError: (error) => {
      console.error("Ошибка при обновлении токена:", error);
    },
  });
};
