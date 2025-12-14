import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mistiq-perfumeries');
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'Hamza@123' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists. Updating password...');
      existingAdmin.password = 'Has81110';
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('✅ Admin user updated successfully');
    } else {
      // Create admin user
      const admin = new User({
        username: 'Hamza@123',
        email: 'mistiqperfumeries@gmail.com',
        password: 'Has81110',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
      });

      await admin.save();
      console.log('✅ Admin user created successfully');
    }

    console.log('Admin Credentials:');
    console.log('Username: Hamza@123');
    console.log('Password: Has81110');
    console.log('Email: mistiqperfumeries@gmail.com');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();

