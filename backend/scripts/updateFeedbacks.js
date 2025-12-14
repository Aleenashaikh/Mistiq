import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Feedback from '../models/Feedback.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mistiq-perfumeries';

const names = ['Sumair Mustafa', 'Umar Shaikh', 'Aqsa Shaikh'];
const products = ['Inferno', 'Morgan', 'La Fleure'];

async function updateFeedbacks() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all feedbacks
    const allFeedbacks = await Feedback.find({});
    console.log(`\nFound ${allFeedbacks.length} feedbacks in database`);

    if (allFeedbacks.length === 0) {
      console.log('⚠️  No feedbacks found to update');
      process.exit(0);
    }

    // Update each feedback with new name and product
    let updatedCount = 0;
    for (let i = 0; i < allFeedbacks.length; i++) {
      const feedback = allFeedbacks[i];
      const nameIndex = i % names.length;
      const productIndex = i % products.length;

      await Feedback.updateOne(
        { _id: feedback._id },
        {
          $set: {
            name: names[nameIndex],
            product: products[productIndex],
          }
        }
      );

      console.log(`Updated feedback ${i + 1}: ${feedback.name} → ${names[nameIndex]}, Product: ${products[productIndex]}`);
      updatedCount++;
    }

    console.log(`\n✅ Successfully updated ${updatedCount} feedbacks`);
    console.log('\nUpdated feedbacks:');
    const updatedFeedbacks = await Feedback.find({}).sort({ createdAt: -1 });
    updatedFeedbacks.forEach((fb, index) => {
      console.log(`${index + 1}. ${fb.name} - ${fb.product || 'No product'} - ${fb.stars} stars`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating feedbacks:', error);
    process.exit(1);
  }
}

updateFeedbacks();

