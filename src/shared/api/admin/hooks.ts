import { useMutation, useQuery, useQueryClient, UseMutationResult } from "react-query";
import { AxiosError } from "axios";

import adminKeys from "./adminKeys";
import { adminApi } from "../client";
import { UserDto } from "../auth/types";


/** Создание пользователя (POST /admin/user/create) */
export const useCreateUser = (): UseMutationResult<
  string,      
  AxiosError,
  UserDto
> => {
  const queryClient = useQueryClient();

  const mutationFn = async (userDto: UserDto) => {
    return await adminApi.createUser(userDto);
  };

  return useMutation({
    mutationFn,
    onSuccess: (newUserId) => {
      console.log("Пользователь создан, ID =", newUserId);
      queryClient.invalidateQueries(adminKeys.all());
    },
  });
};

/** Деактивация пользователя (PUT /admin/user/{id}/deactivate) */
export const useDeactivateUser = (): UseMutationResult<
  void,
  AxiosError,
  string  
> => {
  const queryClient = useQueryClient();

  const mutationFn = async (id: string) => {
    return await adminApi.deactivateUser(id);
  };

  return useMutation({
    mutationFn,
    onSuccess: (_, id) => {
      console.log("Пользователь деактивирован, ID =", id);
      queryClient.invalidateQueries(adminKeys.all());
    },
  });
};

/** Получение списка пользователей (GET /admin/user/all) */
export const useGetAllUsers = () => {
  const queryKey = adminKeys.all();
  const queryFn = () => adminApi.getAllUsers();

  return useQuery<UserDto[], AxiosError>({
    queryKey,
    queryFn,
    refetchOnWindowFocus: false,
  });
};