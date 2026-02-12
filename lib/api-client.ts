import type { ApiResponse, LoginResponse, HealthResponse, DashboardStats, CreateUserRequest, User } from "./types"

// Token management - stored in memory, not localStorage
let authToken: string | null = null

export const tokenManager = {
  setToken: (token: string | null) => {
    authToken = token
  },
  getToken: () => authToken,
  clearToken: () => {
    authToken = null
  },
}

// Base API client with auth support (uses both cookies and Authorization header)
export const apiClient = {
  async get<T>(endpoint: string, requireAuth = true): Promise<T> {
    const headers: HeadersInit = { "Content-Type": "application/json" }
    
    // Add Authorization header if token is available
    if (requireAuth && authToken) {
      headers["Authorization"] = `Bearer ${authToken}`
    }

    // Use credentials: "include" to send cookies
    const response = await fetch(`/api${endpoint}`, { 
      headers,
      credentials: "include",
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(error.message || `API error: ${response.statusText}`)
    }
    return response.json()
  },

  async post<T>(endpoint: string, data?: any, requireAuth = true): Promise<T> {
    const headers: HeadersInit = { "Content-Type": "application/json" }
    
    // Add Authorization header if token is available
    if (requireAuth && authToken) {
      headers["Authorization"] = `Bearer ${authToken}`
    }

    // Use credentials: "include" to send cookies
    const response = await fetch(`/api${endpoint}`, {
      method: "POST",
      headers,
      credentials: "include",
      body: data ? JSON.stringify(data) : undefined,
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(error.message || `API error: ${response.statusText}`)
    }
    return response.json()
  },

  async put<T>(endpoint: string, data: any, requireAuth = true): Promise<T> {
    const headers: HeadersInit = { "Content-Type": "application/json" }
    
    // Add Authorization header if token is available
    if (requireAuth && authToken) {
      headers["Authorization"] = `Bearer ${authToken}`
    }

    // Use credentials: "include" to send cookies
    const response = await fetch(`/api${endpoint}`, {
      method: "PUT",
      headers,
      credentials: "include",
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(error.message || `API error: ${response.statusText}`)
    }
    return response.json()
  },

  async delete<T>(endpoint: string, requireAuth = true): Promise<T> {
    const headers: HeadersInit = { "Content-Type": "application/json" }
    
    // Add Authorization header if token is available
    if (requireAuth && authToken) {
      headers["Authorization"] = `Bearer ${authToken}`
    }

    // Use credentials: "include" to send cookies
    const response = await fetch(`/api${endpoint}`, { 
      method: "DELETE", 
      headers,
      credentials: "include",
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(error.message || `API error: ${response.statusText}`)
    }
    return response.json()
  },
}

// API service functions
export const api = {
  // Health & Debug
  health: {
    check: () => apiClient.get<HealthResponse>("/health", false),
    checkDb: () => apiClient.get<{ db: string; message?: string }>("/health/db", false),
  },

  // Auth
  auth: {
    login: (userId: string, password: string) =>
      apiClient.post<ApiResponse<LoginResponse>>("/login", { userId, password }, false),
    
    logout: () => apiClient.post<{ ok: boolean; message: string }>("/logout"),
    
    me: () => apiClient.get<ApiResponse<{ user: User; token: string }>>("/auth/me"),
    
    changePassword: (currentPassword: string, newPassword: string) =>
      apiClient.post<ApiResponse>("/auth/change-password", { currentPassword, newPassword }),
  },

  // Admin
  admin: {
    createUser: (userData: CreateUserRequest) =>
      apiClient.post<ApiResponse<{ user: User }>>("/admin/create-user", userData),
    
    // Dashboard stats (you'll need to create this endpoint on your backend)
    getStats: () => apiClient.get<ApiResponse<DashboardStats>>("/admin/stats"),
    
    // Users management (you'll need to create these endpoints)
    getUsers: () => apiClient.get<ApiResponse<User[]>>("/admin/users"),
    updateUser: (id: string, data: Partial<User>) =>
      apiClient.put<ApiResponse<User>>(`/admin/users/${id}`, data),
    deleteUser: (id: string) => apiClient.delete<ApiResponse>(`/admin/users/${id}`),
  },
}
