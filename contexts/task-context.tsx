"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import type { Task, TaskInput, TaskUpdate } from "@/lib/models/Task"

interface TaskContextType {
  tasks: Task[]
  loading: boolean
  createTask: (taskData: TaskInput) => Promise<void>
  updateTask: (taskId: string, updates: TaskUpdate) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
  toggleTaskStatus: (taskId: string) => Promise<void>
  refreshTasks: () => Promise<void>
  filteredTasks: Task[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { user } = useAuth()

  const refreshTasks = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response: any = await apiClient.getTasks()
      setTasks(response.tasks || [])
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      refreshTasks()
    }
  }, [user])

  const createTask = async (taskData: TaskInput) => {
    try {
      const response: any = await apiClient.createTask(taskData)
      setTasks((prev) => [...prev, response.task])
    } catch (error) {
      throw error
    }
  }

  const updateTask = async (taskId: string, updates: TaskUpdate) => {
    try {
      const response: any = await apiClient.updateTask(taskId, updates)
      setTasks((prev) => prev.map((task) => (task._id?.toString() === taskId ? response.task : task)))
    } catch (error) {
      throw error
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      await apiClient.deleteTask(taskId)
      setTasks((prev) => prev.filter((task) => task._id?.toString() !== taskId))
    } catch (error) {
      throw error
    }
  }

  const toggleTaskStatus = async (taskId: string) => {
    const task = tasks.find((t) => t._id?.toString() === taskId)
    if (!task) return

    const newStatus = task.status === "completed" ? "pending" : "completed"
    await updateTask(taskId, { status: newStatus })
  }

  // Filter tasks based on search query and status
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || task.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const value = {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    refreshTasks,
    filteredTasks,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
}
