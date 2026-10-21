import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  let isConnected = false;
  let dbName = '';
  let errorMessage: string | null = null;

  try {
    const conn = await connectDB();
    isConnected = mongoose.connection.readyState === 1;
    dbName = conn.connection.name || '';
  } catch (err: any) {
    isConnected = false;
    errorMessage = err?.message || 'Database connection error';
  }

  return NextResponse.json({
    status: 'ok',
    framework: 'Next.js 15 Fullstack',
    timestamp: new Date().toISOString(),
    database: {
      type: 'MongoDB Atlas',
      connected: isConnected,
      name: dbName,
      status: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
      ...(errorMessage ? { error: errorMessage } : {}),
    },
    googleSheetSync: {
      enabled: Boolean(process.env.GOOGLE_SHEET_WEBHOOK_URL),
    },
  });
}
