const keys = {
  all: ['cars'] as const,
  lists: () => [...keys.all, 'list'] as const,
  list: (filters: any) => [...keys.lists(), filters] as const,
  details: () => [...keys.all, 'detail'] as const,
  detail: (id: string) => [...keys.details(), id] as const,
};

export default keys;