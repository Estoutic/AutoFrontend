export enum Locale {
  RU = "RU",
  EU = "EU",
  ZH = "ZH"
}

export interface CarTranslationDto {
  id?: string;           
  carId?: string;     
  locale: Locale;      
  color?: string;
  description?: string;
  mileage?: number;    
  price?: number;
  // New fields to support currency and distance unit information
  currencyCode?: string;
  isMiles?: boolean;
}