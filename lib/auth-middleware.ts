import { auth } from 'firebase-admin';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getApp, getApps, initializeApp, cert } from 'firebase-admin/app';

// Initialize Firebase Admin
// Initialize Firebase Admin if not already initialized
const app = getApps().length === 0 
  ? initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
        // Handle both formats of private key
        privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      }),
    })
  : getApp();

export async function verifyAuth(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decodedToken = await auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
