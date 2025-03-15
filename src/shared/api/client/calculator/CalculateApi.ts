// src/shared/api/calculate/CalculateApi.ts
import { AxiosInstance } from "axios";
import CustomClient from "../CustomApiClient";
import { CustomsCalculationRequestDto, CustomsCalculationResponseDto } from "../../calculator/types";

export interface ICalculateApi {
  calculate: string;
}

export class CalculateApi extends CustomClient<ICalculateApi> {
  constructor(httpClient: AxiosInstance) {
    super(httpClient, {
      calculate: "/calculate",
    });
  }

  // POST /calculate
  async calculateCustoms(
    request: CustomsCalculationRequestDto
  ): Promise<CustomsCalculationResponseDto> {
    const response = await this.client.post<CustomsCalculationResponseDto>(
      this.methods.calculate,
      request
    );
    return response.data;
  }
}