import { AxiosInstance } from "axios";
import CustomClient from "../CustomApiClient";
import { UserDto } from "../../auth/types";

export interface IAdminApi {
  createUser: string;
  deactivateUser: (id: string) => string;
  getAllUsers: string;
}

export class AdminApi extends CustomClient<IAdminApi> {
  constructor(mainHttpClient: AxiosInstance) {
    super(mainHttpClient, {
      createUser: "/admin/user/create",
      deactivateUser: (id: string) => `/admin/user/${id}/deactivate`,
      getAllUsers: "/admin/user/all",
    });
  }

  createUser(userDto: UserDto): Promise<string> {
    return this.client
      .post<string>(this.methods.createUser, userDto)
      .then((res) => res.data);
  }

  deactivateUser(id: string): Promise<void> {
    return this.client
      .put<void>(this.methods.deactivateUser(id))
      .then((res) => res.data);
  }

  getAllUsers(): Promise<UserDto[]> {
    return this.client
      .get<UserDto[]>(this.methods.getAllUsers)
      .then((res) => res.data);
  }
}