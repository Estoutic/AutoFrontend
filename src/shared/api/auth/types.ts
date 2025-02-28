 
export interface RefreshTokenDto {
    refreshToken: string;
  }
  
  
  export interface AuthToken {
    token: string;
    refreshToken: string;
  }
   
  export interface UserDto {
    id?: string;  
    email: string;
    password: string;
    roles?: string[]; 
  }