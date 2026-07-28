export type RideCategory = 'Thriller' | 'Water' | 'Family' | 'Kids' | 'Extreme' | 'Adventure' | string;
export type ThrillLevel = 'Extreme' | 'Adventure' | 'Family' | 'Kids' | string;

export interface Ride {
  id: number;
  name: string;
  category: RideCategory;
  img: string;
  image?: string;
  wait: number;
  rating: number;
  thrill: number;
  duration: string;
  height: string;
  age: string;
  visitors: number;
  status: string;
  zone: string;
  fastPass: boolean;
}
