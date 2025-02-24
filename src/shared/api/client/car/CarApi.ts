import { AxiosInstance, AxiosResponse } from "axios";
import CustomClient from "../CustomApiClient";
import {
  CarCreationDto,
  CarFilterDto,
  CarResponseDto,
  CarUpdateDto,
} from "../../car/types";

export interface ICarApi {
  addCar: string;
  deleteCar: (id: string) => string;
  updateCar: (id: string) => string;
  getCar: (id: string) => string;
  getAllCars: string;
}

export class CarApi extends CustomClient<ICarApi> {
  constructor(mainHttpClient: AxiosInstance) {
    super(mainHttpClient, {
      addCar: "/car",
      deleteCar: (id: string) => `/car/${id}`,
      updateCar: (id: string) => `/car/${id}`,
      getCar: (id: string) => `/car/${id}`,
      getAllCars: "/car/all",
    });
  }
  // POST /car
  addCar(carCreationDto: CarCreationDto): Promise<string> {
    return this.client
      .post<string>(this.methods.addCar, carCreationDto)
      .then((res) => res.data);
  }

  // DELETE /car/{id}
  deleteCar(id: string): Promise<void> {
    return this.client
      .delete<void>(this.methods.deleteCar(id))
      .then((res) => res.data);
  }

  // PATCH /car/{id}
  updateCar(id: string, carUpdateDto: CarUpdateDto): Promise<void> {
    return this.client
      .patch<void>(this.methods.updateCar(id), carUpdateDto)
      .then((res) => res.data);
  }

  // GET /car/{id}?locale=EU
  getCar(id: string, locale: string = "EU"): Promise<CarResponseDto> {
    return this.client
      .get<CarResponseDto>(this.methods.getCar(id), {
        params: { locale },
      })
      .then((res) => res.data);
  }

  // GET /car/all
  getAllCars(
    filterDto: CarFilterDto,
    page = 0,
    size = 10,
    sortBy = "id",
    sortOrder = "asc",
    locale = "EU",
  ): Promise<any> {
    return this.client
      .post(this.methods.getAllCars, filterDto, {
        params: {
          page,
          size,
          sortBy,
          sortOrder,
          locale,
        },
      })
      .then((res) => res.data);
  }
}
