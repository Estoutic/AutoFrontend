const applicationKeys = {
    all: () => ["applications"] as const,
    lists: () => [...applicationKeys.all(), "list"] as const,
    list: (args?: unknown) => [...applicationKeys.lists(), args] as const,
    details: () => [...applicationKeys.all(), "detail"] as const,
    detail: (id: string) => [...applicationKeys.details(), id] as const,
  };
  
  export default applicationKeys;