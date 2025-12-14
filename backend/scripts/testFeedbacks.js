import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Feedback from '../models/Feedback.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mistiq-perfumeries';

async function testFeedbacks() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const allFeedbacks = await Feedback.find({});
    console.log(`\nTotal feedbacks in database: ${allFeedbacks.length}`);
    
    const visibleFeedbacks = await Feedback.find({ isVisible: true });
    console.log(`Visible feedbacks: ${visibleFeedbacks.length}`);
    
    const highRatedFeedbacks = await Feedback.find({ isVisible: true, stars: { $gte: 4 } });
    console.log(`Feedbacks with 4+ stars: ${highRatedFeedbacks.length}`);
    
    if (highRatedFeedbacks.length > 0) {
      console.log('\nHigh-rated feedbacks:');
      highRatedFeedbacks.forEach((fb, index) => {
        console.log(`${index + 1}. ${fb.name} - ${fb.stars} stars - ${fb.isVisible ? 'Visible' : 'Hidden'}`);
      });
    } else {
      console.log('\n⚠️  No feedbacks with 4+ stars found!');
      console.log('\nAll feedbacks:');
      allFeedbacks.forEach((fb, index) => {
        console.log(`${index + 1}. ${fb.name} - ${fb.stars} stars - ${fb.isVisible ? 'Visible' : 'Hidden'}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testFeedbacks();

