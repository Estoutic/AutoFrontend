import { AdminApi } from "./admin/AdminApi";
import createHttpClient from "./apiClient";
import { ApplicationApi } from "./application/ApplicationApi";
import { CarApi } from "./car/CarApi";
import { CarModelApi } from "./carModel/CarModelApi";
import { UserApi } from "./user/UserApi";


const httpClient = createHttpClient("http://0.0.0.0:8088/api");


export const carApi = new CarApi(httpClient);

export const carModelApi = new CarModelApi(httpClient);

export const applicationApi = new ApplicationApi(httpClient);

export const userApi = new UserApi(httpClient);

export const adminApi = new AdminApi(httpClient);


export { default as CustomApiClient } from './CustomApiClient'