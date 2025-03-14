import { useMutation, useQuery, useQueryClient, UseMutationResult } from "react-query";
import { AxiosError } from "axios";
import { ReportDto, ReportFilterDto } from "./types";
import reportKeys from "./reportKeys";
import { adminApi } from "../client";

export const useDeleteReport = (): UseMutationResult<void, AxiosError, string> => {
  const queryClient = useQueryClient();

  return useMutation(
    async (id: string) => {
      await adminApi.deleteReport(id);
    },
    {
      onSuccess: (_, id) => {
        console.log("Отчет удален:", id);
        queryClient.invalidateQueries(reportKeys.all());
      },
    }
  );
};

export const useGetAllReports = (
    filterDto: ReportFilterDto,
    page: number = 0,
    size: number = 10,
    sortBy: string = "id",
    sortOrder: string = "asc"
  ) => {
    const queryKey = reportKeys.list({ filterDto, page, size, sortBy, sortOrder });
    return useQuery<ReportDto[], AxiosError>({
      queryKey,
      queryFn: () => adminApi.getAllReports(filterDto, page, size, sortBy, sortOrder),
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    });
  };

export const useGetReport = (id: string) => {
  return useQuery<string, AxiosError>({
    queryKey: reportKeys.detail(id),
    queryFn: () => adminApi.getReport(id),
    enabled: !!id,
  });
};