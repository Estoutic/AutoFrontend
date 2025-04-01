import { AxiosInstance } from "axios";
import CustomClient from "../CustomApiClient";
import { ApplicationCreationDto, ApplicationDto, ApplicationStatus } from "../../application/types";

export interface IApplicationApi {
  addApplication: string; // "/application"
  deleteApplication: (id: string) => string; // "/application/{id}"
  updateApplicationStatus: (id: string) => string; // "/application/{id}"
  getApplication: (id: string) => string; // "/application/{id}"
  getApplications: string; // "/application/filter"
}

export class ApplicationApi extends CustomClient<IApplicationApi> {
  constructor(mainHttpClient: AxiosInstance) {
    super(mainHttpClient, {
      addApplication: "/application",
      deleteApplication: (id: string) => `/application/${id}`,
      updateApplicationStatus: (id: string) => `/application/${id}`,
      getApplication: (id: string) => `/application/${id}`,
      getApplications: "/application/filter",
    });
  }

  /**
   * POST /application
   * Возвращает UUID (string) созданной заявки
   */
  addApplication(applicationCreationDto: ApplicationCreationDto): Promise<string> {
    console.log("Creating application:", applicationCreationDto);
    
    return this.client
      .post<string>(this.methods.addApplication, applicationCreationDto)
      .then((res) => res.data);
  }

  /**
   * DELETE /application/{id}
   * Возвращает void
   */
  deleteApplication(id: string): Promise<void> {
    return this.client
      .delete<void>(this.methods.deleteApplication(id))
      .then((res) => res.data);
  }

  /**
   * PATCH /application/{id}?status=...
   * Обновляет статус заявки, возвращает void
   */
  updateApplicationStatus(id: string, status: ApplicationStatus): Promise<void> {
    return this.client
      .patch<void>(this.methods.updateApplicationStatus(id), null, {
        params: { status },
      })
      .then((res) => res.data);
  }

  /**
   * GET /application/{id}?locale=EU
   * Возвращает ApplicationDto
   */
  getApplication(id: string, locale: string = "EU"): Promise<ApplicationDto> {
    return this.client
      .get<ApplicationDto>(this.methods.getApplication(id), {
        params: { locale },
      })
      .then((res) => res.data);
  }

  /**
   * GET /application/filter
   * С добавленными параметрами для фильтрации по дате создания
   */
  getApplications(
    status?: ApplicationStatus,
    page: number = 0,
    size: number = 10,
    sortBy: string = "id",
    sortOrder: string = "asc",
    locale: string = "EU",
    createdAfter?: string,
    createdBefore?: string
  ): Promise<any> {
    console.log("Getting applications with filters:", {
      status,
      page,
      size,
      sortBy,
      sortOrder,
      locale,
      createdAfter,
      createdBefore
    });
    
    return this.client
      .get(this.methods.getApplications, {
        params: {
          status,
          page,
          size,
          sortBy,
          sortOrder,
          locale,
          createdAfter,
          createdBefore
        },
      })
      .then((res) => res.data);
  }
}