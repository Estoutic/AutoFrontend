import { AxiosInstance, AxiosResponse } from "axios";
import CustomClient from "../CustomApiClient";
import { AuthToken, RefreshTokenDto, UserDto } from "../../auth/types";

export interface IUserApi {
  auth: string;
  refreshToken: string;
}

export class UserApi extends CustomClient<IUserApi> {
  constructor(mainHttpClient: AxiosInstance) {
    super(mainHttpClient, {
      auth: "/user/auth",
      refreshToken: "/user/refresh-token",
    });
  }

  authUser(userDto: UserDto): Promise<AuthToken> {
    return this.client
      .post<AuthToken>(this.methods.auth, userDto)
      .then((res: AxiosResponse<AuthToken>) => res.data);
  }

  refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthToken> {
    return this.client
      .post<AuthToken>(this.methods.refreshToken, refreshTokenDto)
      .then((res: AxiosResponse<AuthToken>) => res.data);
  }
}