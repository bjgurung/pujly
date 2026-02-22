export interface Service {
  id: string;
  title: string;
  description: string;
  price: number | null;
  duration: number;
  location: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  panditId: string;
  categoryId: string;
}

export interface Pandit {
  id: string;
  name: string;
  specialization: string;
  about: string;
  location: string;
  imageUrl: string;
  languages?: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  experience?: number;
  categoryIds: string[];
  services: string[];
}

export interface Category {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  count: number;
}
