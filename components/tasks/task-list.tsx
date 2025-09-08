"use client"

import { useState } from "react"
import { TaskCard } from "./task-card"
import { TaskForm } from "./task-form"
import { useTasks } from "@/contexts/task-context"
import { CheckSquare, Loader2 } from "lucide-react"
import type { Task } from "@/lib/models/Task"

export function TaskList() {
  const { filteredTasks, loading } = useTasks()
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showTaskForm, setShowTaskForm] = useState(false)

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleCloseForm = () => {
    setShowTaskForm(false)
    setEditingTask(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    )
  }

  if (filteredTasks.length === 0) {
    return (
      <>
        <div className="bg-card rounded-lg border border-border p-6 md:p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:scale-110">
              <CheckSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              Get started by creating your first task or adjust your filters.
            </p>
          </div>
        </div>

        <TaskForm open={showTaskForm} onOpenChange={setShowTaskForm} task={editingTask} />
      </>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {filteredTasks.map((task, index) => (
          <div
            key={task._id?.toString()}
            className="animate-in fade-in-0 slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <TaskCard task={task} onEdit={handleEditTask} />
          </div>
        ))}
      </div>

      <TaskForm open={showTaskForm} onOpenChange={handleCloseForm} task={editingTask} />
    </>
  )
}
