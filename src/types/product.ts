export interface VolumePrice {
  ml: number;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  base_price: number;
  image_url: string | null;
  short_description: string | null;
  full_description: string | null;
  volumes: VolumePrice[];
  top_notes: string[];
  heart_notes: string[];
  base_notes: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  name: string;
  category: string;
  base_price: number;
  short_description: string;
  full_description: string;
  volumes: VolumePrice[];
  top_notes: string[];
  heart_notes: string[];
  base_notes: string[];
}
