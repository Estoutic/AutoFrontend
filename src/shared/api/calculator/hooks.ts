import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { CustomsCalculationRequestDto, CustomsCalculationResponseDto } from "./types";
import { calculateApi } from "../client";

export const useCalculateCustoms = () => {
  return useMutation<CustomsCalculationResponseDto, AxiosError, CustomsCalculationRequestDto>(
    async (request: CustomsCalculationRequestDto) => {
      return await calculateApi.calculateCustoms(request);
    },
    {
      onSuccess: (data) => {
        console.log("Рассчитано:", data);
      },
      onError: (error) => {
        console.error("Ошибка расчёта:", error);
      },
    }
  );
};