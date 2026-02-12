// Client-side API utilities for making requests to the backend
export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`/api${endpoint}`)
    if (!response.ok) throw new Error(`API error: ${response.statusText}`)
    return response.json()
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`/api${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error(`API error: ${response.statusText}`)
    return response.json()
  },

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`/api${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error(`API error: ${response.statusText}`)
    return response.json()
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`/api${endpoint}`, { method: "DELETE" })
    if (!response.ok) throw new Error(`API error: ${response.statusText}`)
    return response.json()
  },
}
