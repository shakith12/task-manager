import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import { verifyAuth } from "@/lib/auth-middleware"
import { ObjectId } from "mongodb"
import type { TaskInput } from "@/lib/models/Task"

export async function GET(request: NextRequest) {
  try {
    const decodedToken = await verifyAuth(request);
    if ('status' in decodedToken) {
      console.error("Authentication failed:", decodedToken);
      return decodedToken;
    }
    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db("taskmanager");
    const tasks = await db.collection("tasks")
      .find({ userId: decodedToken.uid })
      .sort({ order: 1, createdAt: -1 })
      .toArray();
    await client.close();
    return NextResponse.json({ tasks });
  } catch (error: any) {
    console.error("Get tasks error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const decodedToken = await verifyAuth(request);
    if ('status' in decodedToken) {
      return decodedToken;
    }
    const body: TaskInput = await request.json();
    const { title, description, priority, category, dueDate } = body;
    if (!title || !priority || !category) {
      return NextResponse.json({ error: "Title, priority, and category are required" }, { status: 400 });
    }
    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db("taskmanager");
    const existingTasks = await db.collection("tasks")
      .find({ userId: decodedToken.uid })
      .toArray();
    const order = existingTasks.length;
    const newTask = {
      userId: decodedToken.uid,
      title,
      description,
      status: "pending",
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      order,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await db.collection("tasks").insertOne(newTask);
    await client.close();
    return NextResponse.json({
      message: "Task created successfully",
      task: { ...newTask, _id: result.insertedId },
    });
  } catch (error: any) {
    console.error("Create task error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const decodedToken = await verifyAuth(request);
    if ('status' in decodedToken) {
      return decodedToken;
    }
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db("taskmanager");
    const result = await db.collection("tasks").deleteOne({ _id: new ObjectId(id), userId: decodedToken.uid });
    await client.close();
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Task not found or not authorized" }, { status: 404 });
    }
    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error: any) {
    console.error("Delete task error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const decodedToken = await verifyAuth(request);
    if ('status' in decodedToken) {
      return decodedToken;
    }
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No update fields provided" }, { status: 400 });
    }
    updates.updatedAt = new Date();
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db("taskmanager");
    const result = await db.collection("tasks").findOneAndUpdate(
      { _id: new ObjectId(id), userId: decodedToken.uid },
      { $set: updates },
      { returnDocument: "after" }
    );
    await client.close();
    if (!result || !result.value) {
      return NextResponse.json({ error: "Task not found or not authorized" }, { status: 404 });
    }
    return NextResponse.json({ message: "Task updated successfully", task: result.value });
  } catch (error: any) {
    console.error("Edit task error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
