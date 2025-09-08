"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, Plus, MoreHorizontal } from "lucide-react"
import { useTasks } from "@/contexts/task-context"
import { TaskForm } from "@/components/tasks/task-form"
import { MobileSidebar } from "./mobile-sidebar"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function Header() {
  const { searchQuery, setSearchQuery, statusFilter, setStatusFilter } = useTasks()
  const [showTaskForm, setShowTaskForm] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between p-4 md:p-6 bg-background border-b border-border">
        <div className="flex items-center space-x-4 flex-1">
          <MobileSidebar />

          <h2 className="text-xl md:text-2xl font-bold text-foreground">My Tasks</h2>

          <div className="hidden sm:flex items-center space-x-2 ml-4 md:ml-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-48 md:w-64 bg-muted/50 border-border focus:bg-background transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="transition-all duration-200 hover:shadow-sm bg-transparent"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  <span className="hidden md:inline">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Tasks</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("completed")}>Completed</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <ThemeToggle />

          <Button onClick={() => setShowTaskForm(true)} className="transition-all duration-200 hover:shadow-md">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Task</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="transition-all duration-200 hover:shadow-sm bg-transparent"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export Tasks</DropdownMenuItem>
              <DropdownMenuItem>Import Tasks</DropdownMenuItem>
              <DropdownMenuItem>View Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="sm:hidden px-4 py-2 border-b border-border bg-background">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-border focus:bg-background transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <TaskForm open={showTaskForm} onOpenChange={setShowTaskForm} task={null} />
    </>
  )
}
