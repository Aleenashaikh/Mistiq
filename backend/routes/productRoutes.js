import express from 'express';
import Product from '../models/Product.js';
import HeroSection from '../models/HeroSection.js';
import AnnouncementBanner from '../models/AnnouncementBanner.js';

const router = express.Router();

// Get all products (only visible ones for public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isVisible: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get hero section (public route) - MUST come before /:id route
router.get('/hero', async (req, res) => {
  try {
    let hero = await HeroSection.findOne({ isActive: true });
    
    if (!hero) {
      // Return default hero if none exists
      hero = {
        title: 'Discover Scents That Tell Your Story',
        subtitle: 'Let your presence linger beautifully. Explore our handcrafted fragrances designed to match every personality.',
        backgroundImage: '',
        backgroundVideo: '/videos/perfume-hero.mp4',
        primaryButtonText: 'Shop Now',
        secondaryButtonText: 'Vote Your Favorite',
        isActive: true,
      };
    }
    
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get announcement banner (public route) - MUST come before /:id route
router.get('/announcement', async (req, res) => {
  try {
    const banner = await AnnouncementBanner.getActive();
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products by gender (only visible ones)
router.get('/gender/:gender', async (req, res) => {
  try {
    const products = await Product.find({ gender: req.params.gender, isVisible: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product by ID (only if visible) - MUST come last
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isVisible: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

