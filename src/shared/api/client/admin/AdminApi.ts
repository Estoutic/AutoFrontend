// src/shared/api/admin/AdminApi.ts
import { AxiosInstance } from "axios";
import CustomClient from "../CustomApiClient";
import { UserDto } from "../../auth/types";
import { ReportDto, ReportFilterDto } from "../../report/types";

export interface IAdminApi {
  createUser: string;
  deactivateUser: (id: string) => string;
  getAllUsers: string;
  deleteReport: (id: string) => string;
  getAllReports: string;
  getReport: (id: string) => string;
}

export class AdminApi extends CustomClient<IAdminApi> {
  constructor(mainHttpClient: AxiosInstance) {
    super(mainHttpClient, {
      createUser: "/admin/user/create",
      deactivateUser: (id: string) => `/admin/user/${id}/deactivate`,
      getAllUsers: "/admin/user/all",
      deleteReport: (id: string) => `/admin/report/${id}`,
      getAllReports: "/admin/report/all",
      getReport: (id: string) => `/admin/report/${id}`,
    });
  }

  // Создание пользователя
  createUser(userDto: UserDto): Promise<string> {
    return this.client
      .post<string>(this.methods.createUser, userDto)
      .then((res) => res.data);
  }

  // Деактивация пользователя
  deactivateUser(id: string): Promise<void> {
    return this.client
      .put<void>(this.methods.deactivateUser(id))
      .then((res) => res.data);
  }

  // Получение всех пользователей
  getAllUsers(): Promise<UserDto[]> {
    return this.client
      .get<UserDto[]>(this.methods.getAllUsers)
      .then((res) => res.data);
  }

  // Удаление отчёта
  deleteReport(id: string): Promise<void> {
    return this.client
      .delete<void>(this.methods.deleteReport(id))
      .then((res) => res.data);
  }

  // Получение списка отчётов
  getAllReports(
    filterDto: ReportFilterDto,
    page: number,
    size: number,
    sortBy: string,
    sortOrder: string
  ): Promise<ReportDto[]> {
    console.log(filterDto);
    
    return this.client
      .get<ReportDto[]>(this.methods.getAllReports, {
        params: { 
          createdAfter: filterDto.createdAfter,
          createdBefore: filterDto.createdBefore,
          page,
          size,
          sortBy,
          sortOrder,
        },
      })
      .then((res) => res.data);
  }

  getReport(id: string): Promise<string> {
    return this.client
      .get<string>(this.methods.getReport(id))
      .then((res) => res.data);
  }
}