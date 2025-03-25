import { AdminApi } from "./admin/AdminApi";
import createHttpClient from "./apiClient";
import { ApplicationApi } from "./application/ApplicationApi";
import { CalculateApi } from "./calculator/CalculateApi";
import { CarApi } from "./car/CarApi";
import { CarModelApi } from "./carModel/CarModelApi";
import { ImageApi } from "./image/ImageApi";
import { CarTranslationApi } from "./translation/CarTranslationApi";
import { UserApi } from "./user/UserApi";

const httpClient = createHttpClient("https://drujbacarsale.ru/api");

export const carApi = new CarApi(httpClient);

export const carModelApi = new CarModelApi(httpClient);

export const applicationApi = new ApplicationApi(httpClient);

export const userApi = new UserApi(httpClient);

export const adminApi = new AdminApi(httpClient);

export const imageApi = new ImageApi(httpClient);

export const carTranslationApi = new CarTranslationApi(httpClient);

export const calculateApi = new CalculateApi(httpClient);

export { default as CustomApiClient } from "./CustomApiClient";
