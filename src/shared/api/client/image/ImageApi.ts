import { AxiosInstance } from "axios";
import CustomClient from "../CustomApiClient";
import { ImageResponseDto } from "../../image/types";

export interface IImageApi {
  uploadImage: (carId: string) => string;
  uploadMultipleImages: (carId: string) => string;
  getAllImages: (carId: string) => string;
  deleteImage: (carId: string, photoId: string) => string;
}

export class ImageApi extends CustomClient<IImageApi> {
  constructor(httpClient: AxiosInstance) {
    super(httpClient, {
      uploadImage: (carId: string) => `/car/image/${carId}`,
      uploadMultipleImages: (carId: string) => `/car/image/${carId}/multiple`,
      getAllImages: (carId: string) => `/car/image/${carId}/all`,
      deleteImage: (carId: string, photoId: string) => `/car/image/${carId}/photo/${photoId}`,
    });
  }

  async uploadImage(carId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await this.client.post<string>(
      this.methods.uploadImage(carId),
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  }

  async uploadMultipleImages(carId: string, files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    const response = await this.client.post<string[]>(
      this.methods.uploadMultipleImages(carId),
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  }

  async getAllImages(carId: string): Promise<ImageResponseDto> {
    const response = await this.client.get<ImageResponseDto>(
      this.methods.getAllImages(carId)
    );
    return response.data;
  }

  async deleteImage(carId: string, photoId: string): Promise<void> {
    await this.client.delete<void>(this.methods.deleteImage(carId, photoId));
  }
}