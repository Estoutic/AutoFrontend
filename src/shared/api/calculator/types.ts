import { EngineType } from "@/shared/constants/enums/EngineType";
import { TransmissionType } from "@/shared/constants/enums/TransmissionType";
import { VehicleOwnerType } from "@/shared/constants/enums/VehicleOwnerType";
// types.ts
export interface CustomsCalculationRequestDto {
  age: string; // вместо CarAgeCategory
  engineCapacity: number;
  engineType: string; // вместо EngineType
  power: number;
  price: number;
  ownerType: string; // вместо VehicleOwnerType
  currency: string;
  mode: string;
}

enum CarAgeCategory {}
export interface CustomsCalculationResponseDto {
  mode: string; // Режим расчёта (например, ETC, CTP)
  priceRub: number; // Стоимость автомобиля в рублях (если актуально)
  dutyRub: number; // Пошлина
  exciseRub: number; // Акциз
  vatRub: number; // НДС
  clearanceFee: number; // Таможенный сбор
  recyclingFee: number; // Утилизационный сбор
  utilFee: number; // Сбор за утилизацию (базовый), если отличается
  totalPay: number; // Итоговая сумма
}
