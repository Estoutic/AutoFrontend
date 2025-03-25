import { DriveType } from "@/shared/constants/enums/ DriveType";
import { BodyType } from "@/shared/constants/enums/BodyType";
import { EngineType } from "@/shared/constants/enums/EngineType";
import { SteeringPosition } from "@/shared/constants/enums/SteeringPosition";
import { TransmissionType } from "@/shared/constants/enums/TransmissionType";

export interface CarModelDto {
  carModelId?: string;
  brand?: string;
  model?: string;
  generation?: string;
}

export interface CarCreationDto {
  carModelDto?: CarModelDto;
  year?: number;
  description?: string;
  color?: string;
  mileage?: number;
  ownersCount?: number;
  transmissionType?: TransmissionType;
  bodyType?: BodyType;
  enginePower?: string;
  engineType?: EngineType;
  driveType?: DriveType;
  engineCapacity?: string;
  steeringPosition?: SteeringPosition;
  seatsCount?: number;
  price?: number;
  vin?: string;
}

export interface CarUpdateDto {
  year?: number;
  color?: string;
  mileage?: number;
  ownersCount?: number;
  transmissionType?: TransmissionType;
  bodyType?: BodyType;
  enginePower?: string;
  engineType?: EngineType;
  driveType?: DriveType;
  engineCapacity?: string;
  steeringPosition?: SteeringPosition;
  seatsCount?: number;
  price?: number;
}

export interface CarResponseDto {
  id: string;
  carModelId?: string;
  city: string;
  name?: string;
  year?: number;
  description?: string;
  color?: string;
  mileage?: number;
  ownersCount?: number;
  transmissionType?: TransmissionType | string;
  bodyType?: BodyType | string;
  enginePower?: string;
  engineType?: EngineType | string;
  driveType?: DriveType | string;
  engineCapacity?: string;
  steeringPosition?: SteeringPosition | string;
  seatsCount?: number;
  price?: number;
  isAvailable?: boolean;
  images?: string[];
  createdAt?: string;
}

export interface CarFilterDto {
  mileageFrom?: number;
  mileageTo?: number;
  brand?: string;
  model?: string;
  generation?: string;
  priceFrom?: number;
  priceTo?: number;
  ownersCountFrom?: number;
  ownersCountTo?: number;
  transmission?: TransmissionType;
  bodyType?: BodyType;
  yearFrom?: number;
  yearTo?: number;
  enginePowerFrom?: number;
  enginePowerTo?: number;
  engineType?: EngineType;
  drive?: DriveType;
  engineCapacityFrom?: number;
  engineCapacityTo?: number;
  steeringPosition?: SteeringPosition;
  seatsFrom?: number;
  seatsTo?: number;
  sortBy?: string;
  sortOrder?: string;
}


export interface PaginatedCarResponse {
  content: CarResponseDto[];
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}