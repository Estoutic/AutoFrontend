import { useMutation, useQuery, useQueryClient, UseMutationResult } from "react-query";
import { CarTranslationDto } from "./types";
import { AxiosError } from "axios";
import { carTranslationApi } from "../client";
import translationKeys from "./translationKeys";

/** Получение всех переводов для автомобиля */
export const useGetCarTranslations = (carId: string) => {
  return useQuery<CarTranslationDto[], AxiosError>(
    translationKeys.list(carId),
    () => carTranslationApi.getAllTranslations(carId),
    {
      enabled: !!carId,
      refetchOnWindowFocus: false,
    }
  );
};

/** Создание перевода */
export const useCreateCarTranslation = (): UseMutationResult<
  string,        
  AxiosError,     
  CarTranslationDto 
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (dto: CarTranslationDto) => {
      return await carTranslationApi.createTranslation(dto);
    },
    {
      onSuccess: (newId, dto) => {
        if (dto.carId) {
          queryClient.invalidateQueries(translationKeys.list(dto.carId));
        }
      },
    }
  );
};

/** Обновление перевода */
export const useUpdateCarTranslation = (): UseMutationResult<
  void,
  AxiosError,
  { id: string; dto: CarTranslationDto }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, dto }) => {
      await carTranslationApi.updateTranslation(id, dto);
    },
    {
      onSuccess: (_, { dto }) => {
        if (dto.carId) {
          queryClient.invalidateQueries(translationKeys.list(dto.carId));
        }
      },
    }
  );
};

/** Удаление перевода */
export const useDeleteCarTranslation = (): UseMutationResult<
  void,
  AxiosError,
  { id: string; carId: string }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id }) => {
      await carTranslationApi.deleteTranslation(id);
    },
    {
      onSuccess: (_, { carId }) => {
        queryClient.invalidateQueries(translationKeys.list(carId));
      },
    }
  );
};