import createHttpClient from "./apiClient";
import { ApplicationApi } from "./application/ApplicationApi";
import { CarApi } from "./car/CarApi";


const httpClient = createHttpClient("http://0.0.0.0:8088/api");


export const carApi = new CarApi(httpClient);

export const applicationApi = new ApplicationApi(httpClient);

export { default as CustomApiClient } from './CustomApiClient'