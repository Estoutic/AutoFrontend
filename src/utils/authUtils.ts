import { jwtDecode } from "jwt-decode";

 
interface DecodedToken {
  roles: string;  
}


export const getUserRoles = (): string[] => {
  const token = localStorage.getItem("accessToken");
  if (!token) return [];
  try {
    const decoded: DecodedToken = jwtDecode(token);
    console.log(decoded);
    
    return decoded.roles.split(",").map((role) => role.trim());
  } catch (e) {
    console.error("Ошибка при декодировании JWT:", e);
    return [];
  }
};

export const haveSuperAdminRights = (): boolean => {
  const roles = getUserRoles();
  return roles.includes("SUPERADMIN");
};

 
export const haveAdminRights = (): boolean => {
  const roles = getUserRoles();
  return roles.includes("ADMIN") || roles.includes("SUPERADMIN");
};

 
export const haveManagerRights = (): boolean => {
  const roles = getUserRoles();
  return roles.includes("MANAGER") || roles.includes("ADMIN") || roles.includes("SUPERADMIN");
};

