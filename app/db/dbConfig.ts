import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    isConnected = true;

    const connection = mongoose.connection;

    if (connection.listenerCount('connected') === 0) {
      connection.on('connected', () => {
        console.log('MongoDB connected successfully');
      });
    }

    if (connection.listenerCount('error') === 0) {
      connection.on('error', (error) => {
        console.log('MongoDB connection error:', error);
        process.exit(1);
      });
    }
  } catch (error) {
    console.log("something went wrong in connecting to DB", error);
  }
}