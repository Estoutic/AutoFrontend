import { useMutation, useQuery, UseMutationResult, useQueryClient, UseQueryResult } from "react-query";
import { AxiosError } from "axios";
import { CarModelDto, FilterDataDto } from "./types";
import { carModelApi } from "../client";
import carModelKeys from "./carModelKeys";


export const useCreateModel = (): UseMutationResult<string, AxiosError, CarModelDto> => {
  const queryClient = useQueryClient();

  const mutationFn = async (dto: CarModelDto) => {
    const newId = await carModelApi.createModel(dto);
    return newId;
  };

  return useMutation({
    mutationFn,
    onSuccess: (newId) => {
      console.log("CarModel создан, ID =", newId);
     
      // queryClient.invalidateQueries(carModelKeys.lists());
    },
  });
};

/** Удаление модели (DELETE /car/model/{id}) */
export const useDeleteModel = (): UseMutationResult<void, AxiosError, CarModelDto> => {
  const queryClient = useQueryClient();

  const mutationFn = async (carModel: CarModelDto) => {
    await carModelApi.deleteModel(carModel);
  };

  return useMutation({
    mutationFn,
    onSuccess: (_, id) => {
      console.log("CarModel удалён:", id);
      // queryClient.invalidateQueries(carModelKeys.lists());
    },
  });
};

/** Обновление модели (PATCH /car/model/{id}) */
export const useUpdateModel = (): UseMutationResult<void, AxiosError, { id: string; dto: CarModelDto }> => {
  const queryClient = useQueryClient();

  const mutationFn = async ({ id, dto }) => {
    await carModelApi.updateModel(id, dto);
  };

  return useMutation({
    mutationFn,
    onSuccess: (_, { id }) => {
      console.log("CarModel обновлён:", id);
      // queryClient.invalidateQueries(carModelKeys.detail(id));
    },
  });
};

/** Получение списка брендов (GET /car/model/brands) */
export const useGetBrands = () => {
  const queryKey = carModelKeys.list("brands");

  const queryFn = () => carModelApi.getBrands();

  return useQuery<string[], AxiosError>({
    queryKey,
    queryFn,
    refetchOnWindowFocus: false,
    onError: (err) => {
      console.log("Ошибка при получении списка брендов:", err);
    },
  });
};

/** Получение списка моделей (GET /car/model/models?brand=...) */
export const useGetModels = (brand?: string) => {
  const queryKey = carModelKeys.list({ brand });

  const queryFn = () => {
    if (!brand) return Promise.resolve([]); 
    return carModelApi.getModels(brand);
  };

  return useQuery<string[], AxiosError>({
    queryKey,
    queryFn,
    enabled: !!brand, 
    refetchOnWindowFocus: false,
    onError: (err) => {
      console.log("Ошибка при получении списка моделей:", err);
    },
  });
};

/** Получение списка поколений (GET /car/model/generations?model=...) */
export const useGetGenerations = (model?: string) => {
  const queryKey = carModelKeys.list({ model });

  const queryFn = () => {
    if (!model) return Promise.resolve([]);
    return carModelApi.getGenerations(model);
  };

  return useQuery<string[], AxiosError>({
    queryKey,
    queryFn,
    enabled: !!model,
    refetchOnWindowFocus: false,
    onError: (err) => {
      console.log("Ошибка при получении списка поколений:", err);
    },
  });
};

export const useGetAllFilters = (): UseQueryResult<FilterDataDto, AxiosError> => {
    return useQuery<FilterDataDto, AxiosError>({
      queryKey: carModelKeys.allFilters(),
      queryFn: () => carModelApi.getAllFilters(),
      refetchOnWindowFocus: false,
      onError: (err) => {
        console.error("Ошибка при загрузке фильтров:", err);
      },
    });
  };

  export const useGetCarModel = (dto: CarModelDto): UseQueryResult<CarModelDto, AxiosError> => {
    return useQuery<CarModelDto, AxiosError>(
      ["carModel", "detail", dto],
      () => carModelApi.getCarModel(dto),
      {
        enabled: !!dto.brand && !!dto.model && !!dto.generation,  
      }
    );
  };