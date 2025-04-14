import mongoose from 'mongoose';
import { dbConfig } from '../config/db';

export const initDB = async () => {
  try {
    await mongoose.connect(dbConfig.uri, dbConfig.options);
    console.log('MongoDB ga ulandi');
  } catch (err) {
    console.error('MongoDB ulanish xatosi:', err);
    throw err; // Serverni ishga tushirmaslik uchun
  }
};