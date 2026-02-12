export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "coordinator" | "head" | "reviewer" | "participant"
  createdAt: Date
}