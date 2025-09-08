"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, Clock, AlertCircle, Target } from "lucide-react"
import { useTasks } from "@/contexts/task-context"

export function TaskStats() {
  const { tasks } = useTasks()

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const pendingTasks = tasks.filter((task) => task.status === "pending").length
  const highPriorityTasks = tasks.filter((task) => task.priority === "high" && task.status === "pending").length

  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks.toString(),
      change: `${completedTasks} completed`,
      icon: Target,
      color: "text-primary",
    },
    {
      title: "Completed",
      value: completedTasks.toString(),
      change: `${Math.round((completedTasks / Math.max(totalTasks, 1)) * 100)}% completion rate`,
      icon: CheckSquare,
      color: "text-green-600",
    },
    {
      title: "In Progress",
      value: pendingTasks.toString(),
      change: `${pendingTasks} remaining`,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "High Priority",
      value: highPriorityTasks.toString(),
      change: "Needs attention",
      icon: AlertCircle,
      color: "text-red-600",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground truncate">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color} flex-shrink-0`} />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
