const API_BASE = "http://localhost:5000/api";

function getHeaders(): HeadersInit {
  const token = localStorage.getItem("admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...(options?.headers || {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `API Error ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Products
  getProducts: (params?: string) => request<any>(`/products${params ? `?${params}` : ""}`),
  getProduct: (id: string) => request<any>(`/products/${id}`),
  createProduct: (data: any) => request<any>("/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id: string, data: any) => request<any>(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProduct: (id: string) => request<any>(`/products/${id}`, { method: "DELETE" }),

  // Orders
  getOrders: (params?: string) => request<any>(`/orders${params ? `?${params}` : ""}`),
  getOrder: (id: string) => request<any>(`/orders/${id}`),
  updateOrderStatus: (id: string, data: any) => request<any>(`/orders/${id}/status`, { method: "PUT", body: JSON.stringify(data) }),

  // Users
  getUsers: (params?: string) => request<any>(`/users${params ? `?${params}` : ""}`),
  getUser: (id: string) => request<any>(`/users/${id}`),
  updateUser: (id: string, data: any) => request<any>(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  // Reviews
  getProductReviews: (productId: string) => request<any>(`/reviews/product/${productId}`),
  deleteReview: (id: string) => request<any>(`/reviews/${id}`, { method: "DELETE" }),

  // Auth
  login: (email: string, password: string) => request<any>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
};
