export interface CarPhotoDto {
  id: string;
  url: string;
  isMain: boolean;
}

export interface FeatureDto {
  id: string;
  name: string;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  doorsNumber: number;
  luggageCapacity: number;
  engineCapacity: number;
  fuelType: number;
  productionDate: string;
  averageFuelConsumption: number;
  bodyType: number;
  photos?: CarPhotoDto[];
  features?: FeatureDto[];
}

export type NewCar = Omit<Car, 'id'>;

export const FuelTypeLabels: Record<number, string> = {
  0: 'Benzyna',
  1: 'Diesel',
  2: 'Hybryda',
  3: 'Elektryczny',
  4: 'LPG',
};

export const BodyTypeLabels: Record<number, string> = {
  0: 'Hatchback',
  1: 'Sedan',
  2: 'Kombi',
  3: 'SUV',
  4: 'Roadster',
};
