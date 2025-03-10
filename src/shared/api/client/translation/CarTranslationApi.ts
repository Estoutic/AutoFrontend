import { AxiosInstance } from "axios";
import CustomClient from "../CustomApiClient";
import { CarTranslationDto } from "../../translations/types";

export interface ICarTranslationApi {
  createTranslation: string;
  updateTranslation: (id: string) => string;
  deleteTranslation: (id: string) => string;
  getAllTranslations: (carId: string) => string;
}

export class CarTranslationApi extends CustomClient<ICarTranslationApi> {
  constructor(httpClient: AxiosInstance) {
    super(httpClient, {
      createTranslation: "/car/translation",
      updateTranslation: (id: string) => `/car/translation/${id}`,
      deleteTranslation: (id: string) => `/car/translation/${id}`,
      getAllTranslations: (carId: string) => `/car/translation/${carId}/all`,
    });
  }

  /** Создание перевода (POST /car/translation) 
   *  Возвращает UUID созданного перевода 
   */
  async createTranslation(dto: CarTranslationDto): Promise<string> {
    const response = await this.client.post<string>(this.methods.createTranslation, dto);
    return response.data;
  }

  /** Обновление перевода (PATCH /car/translation/{id}) */
  async updateTranslation(id: string, dto: CarTranslationDto): Promise<void> {
    await this.client.patch<void>(this.methods.updateTranslation(id), dto);
  }

  /** Удаление перевода (DELETE /car/translation/{id}) */
  async deleteTranslation(id: string): Promise<void> {
    await this.client.delete<void>(this.methods.deleteTranslation(id));
  }

  /** Получение всех переводов для автомобиля (GET /car/translation/{carId}/all) */
  async getAllTranslations(carId: string): Promise<CarTranslationDto[]> {
    const response = await this.client.get<CarTranslationDto[]>(
      this.methods.getAllTranslations(carId)
    );
    return response.data;
  }
}