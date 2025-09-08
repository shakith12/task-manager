import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  try {
    // Test MongoDB connection
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    
    // Try to ping the database
    await client.db("admin").command({ ping: 1 });
    await client.close();
    
    return NextResponse.json({ status: "MongoDB Connected Successfully!" });
  } catch (error: any) {
    console.error("MongoDB connection error:", error);
    return NextResponse.json(
      { error: `Failed to connect to MongoDB: ${error.message}` },
      { status: 500 }
    );
  }
}
