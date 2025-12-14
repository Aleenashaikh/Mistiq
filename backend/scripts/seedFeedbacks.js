import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Feedback from '../models/Feedback.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mistiq-perfumeries';

const sampleFeedbacks = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    stars: 5,
    comments: 'Absolutely love my purchase! The fragrance is long-lasting and has such a luxurious feel. Mistiq Perfumeries has become my go-to brand for premium scents. Highly recommend!',
    isVisible: true,
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    stars: 5,
    comments: 'Outstanding quality and service! The packaging was elegant and the scent is exactly as described. I\'ve received so many compliments. Will definitely order again!',
    isVisible: true,
  },
  {
    name: 'Emma Williams',
    email: 'emma.williams@email.com',
    stars: 5,
    comments: 'This is by far the best perfume I\'ve ever purchased. The notes are perfectly balanced and it lasts all day. The customer service was exceptional too. Thank you Mistiq!',
    isVisible: true,
  },
];

async function seedFeedbacks() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing feedbacks (optional - remove if you want to keep existing)
    // await Feedback.deleteMany({});

    // Insert sample feedbacks
    const inserted = await Feedback.insertMany(sampleFeedbacks);
    console.log(`✅ Seeded ${inserted.length} feedbacks`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding feedbacks:', error);
    process.exit(1);
  }
}

seedFeedbacks();

