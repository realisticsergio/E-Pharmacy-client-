export interface Product {
  _id: string;
  name: string;
  photo: string;
  supplier: string;
  brand: string;
  stock: number;
  price: number;
  category: string;
  discount: number;
  rating: number;
  description?: string;
}

export interface Pharmacy {
  _id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  rating: number;
  status: 'OPEN' | 'CLOSE';
}

export interface CustomerReview {
  _id: string;
  name: string;
  testimonial: string;
  photo?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CollectionResponse<T> {
  data: T[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
