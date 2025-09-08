"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { TaskProvider } from "@/contexts/task-context"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { TaskStats } from "@/components/dashboard/task-stats"
import { TaskList } from "@/components/tasks/task-list"
import { redirect } from "next/navigation"

export default function DashboardPage() {
  return (
    <AuthGuard fallback={<DashboardRedirect />}>
      <TaskProvider>
        <div className="flex h-screen bg-background">
          <div className="hidden md:block w-64 flex-shrink-0">
            <Sidebar />
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />

            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              <TaskStats />
              <TaskList />
            </main>
          </div>
        </div>
      </TaskProvider>
    </AuthGuard>
  )
}

function DashboardRedirect() {
  redirect("/auth")
  return null
}
