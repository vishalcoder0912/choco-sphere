export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface SessionPayload {
  user: ApiUser;
  token: string;
}

export interface Category {
  id: number;
  name: string;
  createdAt?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: number;
  category: Category;
  createdAt?: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  product: Product;
}

export interface OrderUserSummary {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  shippingAddress?: string;
  paymentMethod?: string;
  paymentDetails?: any;
  items: OrderItem[];
  user?: OrderUserSummary;
  createdAt?: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  pendingOrders: number;
  paidOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  trend: Array<{ date: string; revenue: number; orders: number }>;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: number;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  token?: string;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok) {
    throw new Error(payload?.message ?? "Request failed");
  }
  return payload?.data as T;
}

export const apiClient = {
  baseUrl: API_BASE_URL,

  // Auth
  register: (body: { name: string; email: string; password: string }) =>
    request<SessionPayload>("/auth/register", { method: "POST", body }),
  login: (body: { email: string; password: string }) =>
    request<SessionPayload>("/auth/login", { method: "POST", body }),
  getCurrentUser: (token: string) => request<ApiUser>("/auth/me", { token }),

  // Public
  getProducts: () => request<Product[]>("/products"),
  getProduct: (id: number) => request<Product>(`/products/${id}`),
  getCategories: () => request<Category[]>("/categories"),

  // Customer orders
  createOrder: (
    token: string,
    items: Array<{ productId: number; quantity: number }>,
    shippingAddress: string,
    paymentMethod: string,
    paymentDetails: any
  ) =>
    request<Order>("/orders", {
      method: "POST",
      token,
      body: { items, shippingAddress, paymentMethod, paymentDetails },
    }),
  getOrdersByUser: (userId: number, token: string) =>
    request<Order[]>(`/orders/${userId}`, { token }),

  // Admin: dashboard
  adminGetStats: (token: string) => request<AdminStats>("/admin/stats", { token }),

  // Admin: orders
  adminGetOrders: (token: string) => request<Order[]>("/admin/orders", { token }),
  adminUpdateOrderStatus: (token: string, orderId: number, status: string) =>
    request<Order>(`/admin/orders/${orderId}`, {
      method: "PATCH",
      token,
      body: { status },
    }),
  adminDeleteOrder: (token: string, orderId: number) =>
    request<void>(`/admin/orders/${orderId}`, { method: "DELETE", token }),

  // Admin: products
  adminGetProducts: (token: string) => request<Product[]>("/admin/products", { token }),
  adminCreateProduct: (token: string, body: ProductInput) =>
    request<Product>("/admin/products", { method: "POST", token, body }),
  adminUpdateProduct: (token: string, id: number, body: Partial<ProductInput>) =>
    request<Product>(`/admin/products/${id}`, { method: "PATCH", token, body }),
  adminDeleteProduct: (token: string, id: number) =>
    request<void>(`/admin/products/${id}`, { method: "DELETE", token }),

  // Admin: categories
  adminGetCategories: (token: string) =>
    request<Category[]>("/admin/categories", { token }),
  adminCreateCategory: (token: string, name: string) =>
    request<Category>("/admin/categories", { method: "POST", token, body: { name } }),
  adminUpdateCategory: (token: string, id: number, name: string) =>
    request<Category>(`/admin/categories/${id}`, {
      method: "PATCH",
      token,
      body: { name },
    }),
  adminDeleteCategory: (token: string, id: number) =>
    request<void>(`/admin/categories/${id}`, { method: "DELETE", token }),
};
