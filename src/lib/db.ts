import mongoose from 'mongoose';

/**
 * Global cache for Mongoose connection in Next.js.
 * Prevents multiple connections during hot-reloads in development.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose> {
  let uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'MONGODB_URI is not defined in environment variables. Please add your MongoDB Atlas connection string to .env'
    );
  }

  // Strip wrapping quotes or whitespace if present
  const cleanUri = uri.replace(/^["']|["']$/g, '').trim();

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(cleanUri, opts).then((m) => {
      console.log(`✅ [MongoDB Atlas] Connected to database: ${m.connection.name}`);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null;
    console.error(`❌ [MongoDB Atlas] Connection error:`, e.message);
    throw e;
  }

  return cached.conn;
}
