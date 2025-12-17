import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Feedback from '../models/Feedback.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mistiq-perfumeries';

async function updateFeedbackNames() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Swap Umar Shaikh and Aqsa Shaikh
    // First, temporarily change Umar Shaikh to a placeholder
    await Feedback.updateMany(
      { name: 'Umar Shaikh' },
      { $set: { name: '__TEMP_UMAR__' } }
    );
    console.log(`\n📝 Temporarily moved "Umar Shaikh" entries to placeholder`);

    // Then change Aqsa Shaikh to Umar Shaikh
    const result1 = await Feedback.updateMany(
      { name: 'Aqsa Shaikh' },
      { $set: { name: 'Umar Shaikh' } }
    );
    console.log(`✅ Updated ${result1.modifiedCount} feedback(s) from "Aqsa Shaikh" to "Umar Shaikh"`);

    // Finally, change the placeholder (original Umar Shaikh) to Aqsa Shaikh
    const result2 = await Feedback.updateMany(
      { name: '__TEMP_UMAR__' },
      { $set: { name: 'Aqsa Shaikh' } }
    );
    console.log(`✅ Updated ${result2.modifiedCount} feedback(s) from "Umar Shaikh" to "Aqsa Shaikh"`);

    // Update Sumair Mustafa to Shahzain Mustafa
    const result3 = await Feedback.updateMany(
      { name: 'Sumair Mustafa' },
      { $set: { name: 'Shahzain Mustafa' } }
    );
    console.log(`✅ Updated ${result3.modifiedCount} feedback(s) from "Sumair Mustafa" to "Shahzain Mustafa"`);

    // Update feedback name to Aqsa Shaikh where product is La Fleure
    const result4 = await Feedback.updateMany(
      { product: { $regex: /la fleure/i } },
      { $set: { name: 'Aqsa Shaikh' } }
    );
    console.log(`✅ Updated ${result4.modifiedCount} feedback(s) to "Aqsa Shaikh" where product is "La Fleure"`);

    // Show all feedbacks with the updated names
    console.log('\n📋 All feedbacks with updated names:');
    const allFeedbacks = await Feedback.find({}).sort({ createdAt: -1 });
    
    allFeedbacks.forEach((fb, index) => {
      console.log(`${index + 1}. ${fb.name} - ${fb.product || 'No product'} - ${fb.stars} stars`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating feedback names:', error);
    process.exit(1);
  }
}

updateFeedbackNames();

