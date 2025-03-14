import { ApplicationDto } from "../application/types";

export interface ReportDto {
  id: string;
  name: string;
  filePath: string;
  createdAt: string;  
  applications?: ApplicationDto[];
}
export interface ReportFilterDto {
    createdAfter?: string;  
    createdBefore?: string;  
  }