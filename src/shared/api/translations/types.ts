export enum Locale {
    RU = "RU",
    EN = "EU",
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
  }