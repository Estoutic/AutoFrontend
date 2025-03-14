const reportKeys = {
    all: () => ["reports"] as const,
    list: (params: any) => [...reportKeys.all(), "list", params] as const,
    detail: (id: string) => [...reportKeys.all(), "detail", id] as const,
  };
  
  export default reportKeys;