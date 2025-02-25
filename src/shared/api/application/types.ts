export enum ContactType {
    CALL = "CALL",
    EMAIL = "EMAIL",
    WHATSAPP = "WHATSAPP",
    TELEGRAM = "TELEGRAM",
  }
  
  export enum ApplicationStatus {
    NEW = "NEW",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
    REJECTED = "REJECTED",
  }
  
  export interface ApplicationCreationDto {
    firstName: string;
    lastName: string;
    contact: string;
    contactDetails: string;
    // branchId?: string;  
    carId?: string;    
  }
  
  export interface ApplicationDto {
    id: string;         
    firstName: string;
    lastName: string;
    contact: ContactType;
    status: ApplicationStatus;
    createdAt?: string;   
    updatedAt?: string;
    car?: any;     
    branch?: any;  
  }
  