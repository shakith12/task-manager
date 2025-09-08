import clientPromise from "./mongodb"
import type { User } from "./models/User"
import type { Task } from "./models/Task"
import { ObjectId } from "mongodb"

class Database {
  private static instance: Database
  private client: any

  private constructor() {}

  // Initialize the database when the module loads
  static {
    Database.getInstance();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  private async getClient() {
    if (!this.client) {
      this.client = await clientPromise
    }
    return this.client
  }

  // User operations
  async createUser(user: Omit<User, "_id" | "createdAt" | "updatedAt">): Promise<User> {
    const client = await this.getClient()
    const db = client.db("taskmanager")

    const newUser = {
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("users").insertOne(newUser)
    return { ...newUser, _id: result.insertedId }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const client = await this.getClient()
    const db = client.db("taskmanager")

    return await db.collection("users").findOne({ email })
  }

  async findUserById(id: string): Promise<User | null> {
    const client = await this.getClient()
    const db = client.db("taskmanager")

    return await db.collection("users").findOne({ _id: new ObjectId(id) })
  }

  // Task operations
  async createTask(task: Omit<Task, "_id" | "createdAt" | "updatedAt">): Promise<Task> {
    const client = await this.getClient()
    const db = client.db("taskmanager")

    // Ensure userId is an ObjectId
    const newTask = {
      ...task,
      userId: typeof task.userId === 'string' ? new ObjectId(task.userId) : task.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("tasks").insertOne(newTask)
    return { ...newTask, _id: result.insertedId }
  }

  async getTasksByUserId(userId: string): Promise<Task[]> {
    const client = await this.getClient()
    const db = client.db("taskmanager")

    return await db
      .collection("tasks")
      .find({ userId: new ObjectId(userId) })
      .sort({ order: 1, createdAt: -1 })
      .toArray()
  }

  async updateTask(taskId: string, userId: string, updates: Partial<Task>): Promise<Task | null> {
    const client = await this.getClient()
    const db = client.db("taskmanager")

    const result = await db.collection("tasks").findOneAndUpdate(
      { _id: new ObjectId(taskId), userId: new ObjectId(userId) },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    return result.value
  }

  async deleteTask(taskId: string, userId: string): Promise<boolean> {
    const client = await this.getClient()
    const db = client.db("taskmanager")

    const result = await db.collection("tasks").deleteOne({
      _id: new ObjectId(taskId),
      userId: new ObjectId(userId),
    })

    return result.deletedCount === 1
  }
}

export const db = Database.getInstance()
