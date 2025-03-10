import { useQuery, useMutation, useQueryClient, UseMutationResult } from "react-query";
import { AxiosError } from "axios";
import { ImageResponseDto } from "./types";
import imageKeys from "./imageKeys";
import { imageApi } from "../client";

/** Хук для получения изображений автомобиля */
export const useGetCarImages = (carId: string) => {
  return useQuery<ImageResponseDto, AxiosError>(
    imageKeys.all(carId),
    () => imageApi.getAllImages(carId),
    {
      enabled: !!carId,
      refetchOnWindowFocus: false,
    }
  );
};

/** Хук для загрузки одного изображения */
export const useUploadImage = (): UseMutationResult<
  string, // возвращается UUID
  AxiosError,
  { carId: string; file: File }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ carId, file }) => {
      return await imageApi.uploadImage(carId, file);
    },
    {
      onSuccess: (_, { carId }) => {
        queryClient.invalidateQueries(imageKeys.all(carId));
      },
    }
  );
};

/** Хук для загрузки нескольких изображений */
export const useUploadMultipleImages = (): UseMutationResult<
  string[], // список UUID
  AxiosError,
  { carId: string; files: File[] }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ carId, files }) => {
      return await imageApi.uploadMultipleImages(carId, files);
    },
    {
      onSuccess: (_, { carId }) => {
        queryClient.invalidateQueries(imageKeys.all(carId));
      },
    }
  );
};

/** Хук для удаления изображения */
export const useDeleteImage = (): UseMutationResult<
  void,
  AxiosError,
  { carId: string; photoId: string }
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ carId, photoId }) => {
      await imageApi.deleteImage(carId, photoId);
    },
    {
      onSuccess: (_, { carId }) => {
        queryClient.invalidateQueries(imageKeys.all(carId));
      },
    }
  );
};