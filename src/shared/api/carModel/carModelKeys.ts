const carModelKeys = {
    all: () => ["carModel"] as const,
    lists: () => [...carModelKeys.all(), "list"] as const,
    list: (params?: unknown) => [...carModelKeys.lists(), { params }] as const,
    details: () => [...carModelKeys.all(), "detail"] as const,
    detail: (id: string) => [...carModelKeys.details(), id] as const,
    allFilters: () => ['allFilters']
  };
  
  export default carModelKeys;