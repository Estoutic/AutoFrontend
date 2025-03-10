const translationKeys = {
    all: ["carTranslations"] as const,
    list: (carId: string) => [...translationKeys.all, carId] as const,
  };
  
  export default translationKeys;