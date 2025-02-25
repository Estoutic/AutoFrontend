import { useMutation, useQuery, useQueryClient, UseMutationResult } from "react-query";
import { AxiosError } from "axios";
import { 
  ApplicationCreationDto, 
  ApplicationDto, 
  ApplicationStatus 
} from "./types";
import applicationKeys from "./applicationKeys";
import { applicationApi } from "../client";

/** Создание заявки (POST /application) */
export const useAddApplication = (): UseMutationResult<
  string,            
  AxiosError,
  ApplicationCreationDto
> => {
  const queryClient = useQueryClient();

  const mutationFn = async (data: ApplicationCreationDto) => {
    const newAppId = await applicationApi.addApplication(data);
    return newAppId;
  };

  return useMutation({
    mutationFn,
    onSuccess: (newAppId) => {
      console.log("Создана заявка, ID =", newAppId);
      queryClient.invalidateQueries(applicationKeys.lists());
    },
  });
};

/** Удаление заявки (DELETE /application/{id}) */
export const useDeleteApplication = (): UseMutationResult<
  void,
  AxiosError,
  string 
> => {
  const queryClient = useQueryClient();

  const mutationFn = async (id: string) => {
    await applicationApi.deleteApplication(id);
  };

  return useMutation({
    mutationFn,
    onSuccess: (_, id) => {
      console.log("Заявка удалена:", id);
      queryClient.invalidateQueries(applicationKeys.lists());
    },
  });
};

/** Обновление статуса заявки (PATCH /application/{id}?status=...) */
export const useUpdateApplicationStatus = (): UseMutationResult<
  void,
  AxiosError,
  { id: string; status: ApplicationStatus }
> => {
  const queryClient = useQueryClient();

  const mutationFn = async ({ id, status }) => {
    await applicationApi.updateApplicationStatus(id, status);
  };

  return useMutation({
    mutationFn,
    onSuccess: (_, { id, status }) => {
      console.log(`Статус заявки ${id} обновлён на ${status}`);
      queryClient.invalidateQueries(applicationKeys.detail(id));
      queryClient.invalidateQueries(applicationKeys.lists());
    },
  });
};

/** Получение заявки по ID (GET /application/{id}) */
export const useGetApplicationById = (id: string, locale = "EU") => {
  const queryKey = applicationKeys.detail(id);

  const queryFn = () => applicationApi.getApplication(id, locale);

  return useQuery<ApplicationDto, AxiosError>({
    queryKey,
    queryFn,
    enabled: !!id,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};

/** Получение списка заявок (GET /application/filter) */
export const useGetApplications = (
  status?: ApplicationStatus,
  page = 0,
  size = 10,
  sortBy = "id",
  sortOrder = "asc",
  locale = "EU"
) => {
  const queryKey = applicationKeys.list({ status, page, size, sortBy, sortOrder, locale });

  const queryFn = () => applicationApi.getApplications(
    status,
    page,
    size,
    sortBy,
    sortOrder,
    locale,
  );

  return useQuery({
    queryKey,
    queryFn,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    onError: (err) => {
      console.log("Ошибка при получении списка заявок:", err);
    },
  });
};