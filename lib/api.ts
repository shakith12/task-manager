// API client utilities for frontend
const API_BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000/api" : "/api"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

import { auth } from './firebase';

export const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await auth.currentUser?.getIdToken();

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }))
      throw new ApiError(response.status, error.error || "Request failed")
    }

    return response.json()
  },

  // Auth endpoints
  async register(userData: { name: string; email: string; password: string }) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  async login(credentials: { email: string; password: string }) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  },

  async getMe() {
    return this.request("/auth/me")
  },

  // Task endpoints
  async getTasks() {
    return this.request("/tasks")
  },

  async createTask(taskData: any) {
    return this.request("/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    })
  },

  async updateTask(taskId: string, updates: any) {
    return this.request("/tasks", {
      method: "PATCH",
      body: JSON.stringify({ id: taskId, ...updates }),
    })
  },

  async deleteTask(taskId: string) {
    return this.request("/tasks", {
      method: "DELETE",
      body: JSON.stringify({ id: taskId }),
    })
  },
}
