const imageKeys = {
    all: (carId: string) => ["carImages", carId] as const,
  };
  
  export default imageKeys;