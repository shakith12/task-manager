import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { getUserFromToken } from "@/lib/auth"
import type { TaskUpdate } from "@/lib/models/Task"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    const userPayload = getUserFromToken(authHeader)

    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: TaskUpdate = await request.json()
    const { title, description, status, priority, category, dueDate, order } = body

    const updates: any = {}
    if (title !== undefined) updates.title = title
    if (description !== undefined) updates.description = description
    if (status !== undefined) updates.status = status
    if (priority !== undefined) updates.priority = priority
    if (category !== undefined) updates.category = category
    if (dueDate !== undefined) updates.dueDate = dueDate ? new Date(dueDate) : null
    if (order !== undefined) updates.order = order

    const task = await db.updateTask(params.id, userPayload.userId, updates)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Task updated successfully",
      task,
    })
  } catch (error) {
    console.error("Update task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    const userPayload = getUserFromToken(authHeader)

    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const success = await db.deleteTask(params.id, userPayload.userId)

    if (!success) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Task deleted successfully",
    })
  } catch (error) {
    console.error("Delete task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
