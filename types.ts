export type UserRole = "user" | "admin";

export interface PublicUser {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  role: UserRole;
  credits: number;
  emailVerified: boolean;
  createdAt: string;
}

export type ProductKind = "plugin" | "resource" | "build" | "configuration";

export interface Product {
  id: string;
  title: string;
  slug: string;
  kind: ProductKind;
  category: string;
  shortDescription: string;
  description?: string;
  tags: string[];
  price: number;
  isFree: boolean;
  authorName: string;
  minecraftVersion: string;
  version: string;
  gradient: string;
  isFeatured: boolean;
  downloadsCount: number;
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
  isFavorited: boolean;
  isOwned: boolean;
  favoritedAt?: string;
}

export interface ProductListResponse {
  products: Product[];
  categories: string[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export interface ProductDetailResponse {
  product: Product;
  related: Product[];
}

export interface LibraryItem {
  id: string;
  title: string;
  slug: string;
  kind: ProductKind;
  category: string;
  gradient: string;
  price: number;
  source: "purchased" | "free";
  acquiredAt: string;
}

export interface OrderItem {
  product: string;
  title: string;
  price: number;
}

export type OrderStatus = "completed" | "pending" | "refunded" | "failed";

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  paymentMethod: "credits" | "mock_card";
  status: OrderStatus;
  createdAt: string;
}

export interface Service {
  _id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  priceFrom: number;
  deliveryTime: string;
  icon: string;
  isActive: boolean;
  isFeatured: boolean;
}

export type ServiceRequestStatus = "pending" | "in_review" | "accepted" | "completed" | "declined";

export interface ServiceRequest {
  _id: string;
  service: Service;
  message: string;
  budget?: number;
  status: ServiceRequestStatus;
  createdAt: string;
}

export interface AdminStats {
  users: number;
  products: number;
  orders: number;
  revenue: number;
  pendingServiceRequests: number;
  bannedUsers: number;
}

export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  credits: number;
  isBanned: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface DashboardSummary {
  user: {
    id: string;
    username: string;
    avatarUrl?: string;
    role: UserRole;
    credits: number;
    memberSince: string;
  };
  stats: {
    downloads: number;
    purchases: number;
    favorites: number;
    credits: number;
    projects: number;
  };
  unreadNotifications: number;
  recentActivity: {
    id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    read: boolean;
    createdAt: string;
  }[];
}
