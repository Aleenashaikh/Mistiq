import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import voteRoutes from './routes/voteRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mistiq Perfumeries API is running' });
});

// MongoDB connection - optimized for serverless
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mistiq-perfumeries';

// Connection state for serverless reuse
let isConnected = false;
let connectionPromise = null;

const connectDB = async () => {
  // If already connected, return
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  // If connection is in progress, wait for it
  if (connectionPromise) {
    return connectionPromise;
  }

  // Start new connection
  connectionPromise = mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    .then(() => {
      isConnected = true;
      console.log('✅ Connected to MongoDB');
      connectionPromise = null;
    })
    .catch((error) => {
      console.error('❌ MongoDB connection error:', error.message);
      connectionPromise = null;
      isConnected = false;
      throw error;
    });

  return connectionPromise;
};

// Connect to MongoDB on module load (for serverless)
// This will be called once per serverless function instance
if (process.env.VERCEL) {
  // On Vercel, connect immediately
  connectDB().catch((error) => {
    console.error('Failed to connect to MongoDB:', error.message);
  });
} else {
  // For local development, connect and start server
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('❌ MongoDB connection error:', error.message);
      console.error('Make sure MongoDB is running on:', MONGODB_URI);
      // Still start the server so we can see other errors
      app.listen(PORT, () => {
        console.log(`⚠️  Server running on port ${PORT} but MongoDB is not connected`);
      });
    });
}

export default app;

