export interface CarModelDto {
    carModelId?: string;
    brand?: string;
    model?: string;
    generation?: string;
  }
  
  export interface FilterDataDto {
    brands: string[];
    models: { [brand: string]: string[] };
    generations: { [model: string]: string[] };
  }