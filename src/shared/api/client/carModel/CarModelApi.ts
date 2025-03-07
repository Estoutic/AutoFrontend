import { AxiosInstance } from "axios";
import CustomClient from "../CustomApiClient";
import { CarModelDto } from "../../car/types";
import { FilterDataDto } from "../../carModel/types";
import { an } from "react-router/dist/development/route-data-Cq_b5feC";

export interface ICarModelApi {
  createModel: string;
  deleteModel: string;
  updateModel: (id: string) => string;
  getBrands: string;
  getModels: string;
  getGenerations: string;
  getAllFilters: string;
  getCarModel: string;
}

export class CarModelApi extends CustomClient<ICarModelApi> {
  constructor(mainHttpClient: AxiosInstance) {
    super(mainHttpClient, {
      createModel: "/car/model",
      deleteModel: "/car/model",
      updateModel: (id: string) => `/car/model/${id}`,
      getBrands: "/car/model/brands",
      getModels: "/car/model/models",
      getGenerations: "/car/model/generations",
      getAllFilters: "/car/model/allFilters",
      getCarModel: "/car/model",
    });
  }

  // POST /car/model
  createModel(dto: CarModelDto): Promise<string> {
    return this.client
      .post<string>(this.methods.createModel, dto)
      .then((res) => res.data);
  }

  // DELETE /car/model
  deleteModel(carModel: CarModelDto): Promise<void | any> {
    return this.client.delete<void | any>(this.methods.deleteModel, {
        params: {
            carModelId: carModel.carModelId,
            brand: carModel.brand,
            model: carModel.model,
            generation: carModel.generation
        }
    });
}

  // PATCH /car/model/{id}
  updateModel(id: string, dto: CarModelDto): Promise<void> {
    return this.client
      .patch<void>(this.methods.updateModel(id), dto)
      .then((res) => res.data);
  }

  // GET /car/model/brands
  getBrands(): Promise<string[]> {
    return this.client
      .get<string[]>(this.methods.getBrands)
      .then((res) => res.data);
  }

  // GET /car/model/models?brand=...
  getModels(brand: string): Promise<string[]> {
    return this.client
      .get<string[]>(this.methods.getModels, {
        params: { brand },
      })
      .then((res) => res.data);
  }

  // GET /car/model/generations?model=...
  getGenerations(model: string): Promise<string[]> {
    return this.client
      .get<string[]>(this.methods.getGenerations, {
        params: { model },
      })
      .then((res) => res.data);
  }

  getAllFilters(): Promise<FilterDataDto> {
    return this.client
      .get<FilterDataDto>(this.methods.getAllFilters)
      .then((res) => res.data);
  }

  getCarModel(dto: CarModelDto): Promise<CarModelDto> {
    return this.client
      .request<CarModelDto>({
        url: this.methods.getCarModel,
        method: "GET",
        data: dto,
      })
      .then((res) => res.data);
  }
}
