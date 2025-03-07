import { AxiosError } from "axios";
import { useMutation, useQuery, UseMutationResult, useQueryClient } from "react-query";
import { carApi } from "../client";  
import keys from "./keys";
import { CarCreationDto, CarFilterDto, CarResponseDto, CarUpdateDto } from "./types";


/**
 * Создание новой машины (POST /car)
 * Возвращает ID созданной машины (string)
 */
export const useAddCar = (): UseMutationResult<string, AxiosError, CarCreationDto> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (carData: CarCreationDto) => {
      const newCarId = await carApi.addCar(carData);
      return newCarId;
    },
    onSuccess: (newCarId) => {
      console.log("Создана машина, ID =", newCarId);
      queryClient.invalidateQueries("cars");  
      queryClient.invalidateQueries(keys.detail(newCarId));  
      queryClient.refetchQueries("cars");  
    },
  });
};

/**
 * Получение машины по ID (GET /car/{id})
 */
export const useGetCarById = (carId: string, locale: string = "EU") => {
  const queryKey = keys.detail(carId);

  const queryFn = () => carApi.getCar(carId, locale);

  return useQuery<CarResponseDto, AxiosError>({
    queryKey,
    queryFn,
    enabled: !!carId,  
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};

/**
 * Получение списка машин (GET /car/all)
 */
export const useGetAllCars = (filterDto?: CarFilterDto, page = 0, size = 10, sortBy = "id", sortOrder = "asc", locale = "EU") => {
  console.log(filterDto);
  
  const queryKey = keys.list({ filterDto, page, size, sortBy, sortOrder, locale });

  const queryFn = () => carApi.getAllCars(filterDto? filterDto: {}, page, size, sortBy, sortOrder, locale);

  return useQuery({
    queryKey,
    queryFn,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    onError: (err) => {
      console.log("Ошибка при получении списка машин:", err);
    },
  });
};

/**
 * Обновление машины (PATCH /car/{id})
 * Возвращает void (или статус).
 */
export const useUpdateCar = (): UseMutationResult<void, AxiosError, { id: string; data: CarUpdateDto }> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CarUpdateDto }) => {
      await carApi.updateCar(id, data);
    },
    onSuccess: (_, variables) => {
      console.log(`Машина ${variables.id} обновлена`);
      queryClient.invalidateQueries(keys.detail(variables.id));  
      queryClient.invalidateQueries("cars");  
      queryClient.refetchQueries("cars");  
    },
  });
};

/**
 * Удаление машины (DELETE /car/{id})
 * Возвращает void
 */
export const useDeleteCar = (): UseMutationResult<void, AxiosError, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (carId: string) => {
      await carApi.deleteCar(carId);
    },
    onSuccess: (_, carId) => {
      console.log(`Машина удалена: ${carId}`);
      queryClient.invalidateQueries(keys.detail(carId)); 
      queryClient.invalidateQueries("cars"); 
      queryClient.refetchQueries("cars"); 
    },
  });
};