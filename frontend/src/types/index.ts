/**
 * TypeScript type definitions for Neo-Brisnet frontend
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  contentType: string;
  cashPrice: number;
  creditPrice: number;
  thumbnail?: string;
  downloadUrl?: string;
  popularity: number;
  isFeatured: boolean;
  tags: {
    track?: string;
    date?: string;
    raceType?: string;
    productType: string;
    creator?: string;
  };
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  paymentMethod: 'cash' | 'credits';
}

export interface CreditBalance {
  balance: number;
  expiringCredits: Array<{
    amount: number;
    expiresAt: string;
  }>;
}

export interface Order {
  id: string;
  userId: string;
  status: string;
  cashTotal: number;
  creditsTotal: number;
  createdAt: string;
  completedAt?: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: string;
  productId: string;
  productSnapshot: Product;
  paymentMethod: 'cash' | 'credits';
  price?: number;
  creditPrice?: number;
}

export interface Filters {
  tracks: string[];
  productTypes: string[];
  creators: string[];
}
