import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("taskmanager");
    
    // Test the connection
    await db.command({ ping: 1 });
    
    return NextResponse.json({ status: "Connected to MongoDB!" });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ error: "Failed to connect to database" }, { status: 500 });
  }
}
