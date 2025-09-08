import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export interface UserInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}
