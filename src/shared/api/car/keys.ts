const carKeys = {
    all: () => ["cars"] as const, 
    lists: () => [...carKeys.all(), "list"] as const,
    list: (filter?: unknown) => [...carKeys.lists(), { filter }] as const,
    details: () => [...carKeys.all(), "detail"] as const,
    detail: (id: string) => [...carKeys.details(), id] as const,
  };
  
  export default carKeys;