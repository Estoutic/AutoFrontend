export interface ImageDto {
  id: string;
  path: string;
}

export interface ImageResponseDto {
  carId: string;
  images: ImageDto[];
}
