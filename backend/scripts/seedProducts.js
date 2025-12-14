import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const products = [
  {
    name: 'La Fleure',
    gender: 'Female',
    impressionOf: 'Gucci Flora',
    topNotes: ['Bergamot', 'Citrus', 'Peony'],
    heartNotes: ['Rose', 'Jasmine', 'Osmanthus'],
    baseNotes: ['Musk', 'Vanilla', 'Sandalwood'],
    bottleImage: '/images/perfumes/la-fleure.jpg',
    themeColor: '#d63384',
    rating: 4.8,
    votes: 0,
    description: 'A delicate floral fragrance that captures the essence of a blooming garden. La Fleure is a celebration of femininity with its soft peony and rose notes, perfect for those who love elegant, timeless scents.',
    price: 89.99,
    stock: 50,
  },
  {
    name: 'Belle Aura',
    gender: 'Female',
    impressionOf: 'Miss Dior',
    topNotes: ['Mandarin', 'Bergamot', 'Pink Pepper'],
    heartNotes: ['Rose', 'Lily of the Valley', 'Jasmine'],
    baseNotes: ['Patchouli', 'Amber', 'Musk'],
    bottleImage: '/images/perfumes/belle-aura.jpg',
    themeColor: '#6f42c1',
    rating: 4.9,
    votes: 0,
    description: 'An enchanting blend of floral and fruity notes that creates an aura of sophistication. Belle Aura is for the modern woman who embraces her femininity with confidence and grace.',
    price: 94.99,
    stock: 45,
  },
  {
    name: 'Inferno',
    gender: 'Male',
    impressionOf: 'Tuscan Leather',
    topNotes: ['Black Pepper', 'Saffron', 'Raspberry'],
    heartNotes: ['Leather', 'Jasmine', 'Olive Blossom'],
    baseNotes: ['Leather', 'Musk', 'Suede'],
    bottleImage: '/images/perfumes/inferno.jpg',
    themeColor: '#d4af37',
    rating: 4.7,
    votes: 0,
    description: 'A bold, intoxicating scent that embodies raw masculinity. Inferno combines the richness of leather with spicy top notes, creating a fragrance that commands attention and leaves a lasting impression.',
    price: 99.99,
    stock: 60,
  },
  {
    name: 'Valiant',
    gender: 'Male',
    impressionOf: 'Azzaro Wanted',
    topNotes: ['Lemon', 'Ginger', 'Lavender'],
    heartNotes: ['Juniper', 'Cinnamon', 'Patchouli'],
    baseNotes: ['Tonka Bean', 'Amberwood', 'Vanilla'],
    bottleImage: '/images/perfumes/valiant.jpg',
    themeColor: '#d4af37',
    rating: 4.6,
    votes: 0,
    description: 'A dynamic and energetic fragrance that captures the spirit of adventure. Valiant blends fresh citrus with warm spices, perfect for the man who lives life with passion and determination.',
    price: 89.99,
    stock: 55,
  },
  {
    name: 'Magnus Noir',
    gender: 'Male',
    impressionOf: 'Sauvage Dior',
    topNotes: ['Calabrian Bergamot', 'Pepper'],
    heartNotes: ['Sichuan Pepper', 'Lavender', 'Pink Pepper'],
    baseNotes: ['Ambroxan', 'Cedar', 'Labdanum'],
    bottleImage: '/images/perfumes/magnus-noir.jpg',
    themeColor: '#d4af37',
    rating: 4.9,
    votes: 0,
    description: 'A powerful, magnetic fragrance that defines modern masculinity. Magnus Noir combines fresh bergamot with deep, woody base notes, creating a scent that is both sophisticated and irresistibly bold.',
    price: 104.99,
    stock: 40,
  },
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mistiq-perfumeries');
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log('✅ Seeded products successfully');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();

