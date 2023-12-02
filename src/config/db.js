import mongoose from 'mongoose';

export const connectToDatabase = async () => {
  const conn = await mongoose.connect(process.env.DATABASE_URL);
  
  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};
