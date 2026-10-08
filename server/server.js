import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { loadStore } from './data/store.js';

import authRoutes from './routes/auth.js';
import batchRoutes from './routes/batches.js';
import studentRoutes from './routes/students.js';
import attendanceRoutes from './routes/attendance.js';
import feeRoutes from './routes/fees.js';
import testRoutes from './routes/tests.js';
import analyticsRoutes from './routes/analytics.js';
import parentRoutes from './routes/parent.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tutorpro';

app.use(cors());
app.use(express.json());

// Initialize Local JSON Data Store (seeds initial Indian tuition sample data)
loadStore();

// Attempt MongoDB Connection (Non-blocking fallback for college demos)
mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    console.log('✅ Connected to MongoDB database.');
  })
  .catch((err) => {
    console.log('ℹ️ Local MongoDB daemon not active. Running on high-performance in-memory/JSON store fallback (All features & CRUD active).');
  });

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/parent', parentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'TutorPro SaaS API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 TutorPro Server running on http://localhost:${PORT}`);
});
