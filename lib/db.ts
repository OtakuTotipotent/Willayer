import mongoose from "mongoose";

const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/willayer";

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable.");
}

// cached connection across hot reloads in development
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
    // If connection already established (The pool is active)
    if (cached.conn) {
        return cached.conn;
    }
    // If currently connecting (Handshaking), we don't have promise (same promise)
    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // don't queue if DB is disconnected
            maxPoolSize: 10, // keeping 10 "Phone Lines" open
        };
        console.log("⚡ Initializing new database connection...");
        cached.promise = mongoose
            .connect(MONGODB_URI, opts)
            .then((mongoose) => {
                return mongoose;
            });
    }

    // Await the handshake and cache the result (we've promise)
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    // Finally connection establishes
    return cached.conn;
}

export default connectDB;
