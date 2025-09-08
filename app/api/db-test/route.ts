import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ error: "MONGODB_URI not found in environment variables" }, { status: 500 });
  }

  try {
    console.log("Connecting to MongoDB...");
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    console.log("Connected to MongoDB, testing database...");
    const db = client.db("taskmanager");
    const collections = await db.listCollections().toArray();
    
    console.log("Collections found:", collections);
    await client.close();
    
    return NextResponse.json({ 
      status: "Connected successfully!", 
      collections: collections.map(c => c.name)
    });
  } catch (error: any) {
    console.error("MongoDB connection error:", error);
    return NextResponse.json({ 
      error: "Failed to connect to MongoDB",
      details: error.message
    }, { status: 500 });
  }
}
