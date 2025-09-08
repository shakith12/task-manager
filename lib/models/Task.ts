import type { ObjectId } from "mongodb"

export type TaskStatus = "pending" | "completed"
export type TaskPriority = "low" | "medium" | "high"
export type TaskCategory = "Work" | "Study" | "Personal"

export interface Task {
  _id?: ObjectId
  userId: ObjectId
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  category: TaskCategory
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  order: number
}

export interface TaskInput {
  title: string
  description?: string
  priority: TaskPriority
  category: TaskCategory
  dueDate?: string
}

export interface TaskUpdate {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  category?: TaskCategory
  dueDate?: string
  order?: number
}
