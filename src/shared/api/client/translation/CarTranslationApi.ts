import { AxiosInstance } from "axios";
import { CarTranslationDto } from "../../translations/types";
import { getDefaultCurrencyCode, isLocaleUsingMiles } from "../../translations/utils";

export class CarTranslationApi {
  private readonly httpClient: AxiosInstance;
  private readonly basePath = "/car/translations";

  constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  /**
   * Get all translations for a car
   */
  async getAllTranslations(carId: string): Promise<CarTranslationDto[]> {
    const response = await this.httpClient.get(`${this.basePath}/car/${carId}`);
    return response.data;
  }

  /**
   * Create a new translation
   * Adds default currency code and isMiles flag based on locale if not provided
   */
  async createTranslation(dto: CarTranslationDto): Promise<string> {
    // Add default currency and distance unit if not specified
    const enrichedDto = this.enrichTranslationDto(dto);
    
    const response = await this.httpClient.post(this.basePath, enrichedDto);
    return response.data;
  }

  /**
   * Update an existing translation
   * Adds default currency code and isMiles flag based on locale if not provided
   */
  async updateTranslation(id: string, dto: CarTranslationDto): Promise<void> {
    // Add default currency and distance unit if not specified
    const enrichedDto = this.enrichTranslationDto(dto);
    
    await this.httpClient.put(`${this.basePath}/${id}`, enrichedDto);
  }

  /**
   * Delete a translation
   */
  async deleteTranslation(id: string): Promise<void> {
    await this.httpClient.delete(`${this.basePath}/${id}`);
  }

  /**
   * Helper method to add default currency and distance unit based on locale
   */
  private enrichTranslationDto(dto: CarTranslationDto): CarTranslationDto {
    const result = { ...dto };
    
    if (dto.locale && !dto.currencyCode) {
      result.currencyCode = getDefaultCurrencyCode(dto.locale);
    }
    
    if (dto.locale && dto.isMiles === undefined) {
      result.isMiles = isLocaleUsingMiles(dto.locale);
    }
    
    return result;
  }
}