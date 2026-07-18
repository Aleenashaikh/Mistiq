import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import HeroSection from '../models/HeroSection.js';
import AnnouncementBanner from '../models/AnnouncementBanner.js';
import { slugify } from '../utils/slugify.js';

const router = express.Router();

// Get all products (only visible ones for public)
router.get('/', async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection error. Please try again later.',
        error: 'MongoDB not connected'
      });
    }

    // Add caching headers
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600'); // 5 min browser, 10 min CDN
    
    const products = await Product.find({ isVisible: true })
      .sort({ createdAt: -1 })
      .select('name slug bottleImage hoverImage price actualPrice discountedPrice stock rating gender impressionOf themeColor isVisible description') // Only select needed fields
      .lean() // Use lean() for faster queries
      .maxTimeMS(20000); // Add query timeout (20 seconds)
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongoServerError' || error.name === 'MongoTimeoutError' || error.message.includes('buffering timed out')) {
      return res.status(503).json({ 
        message: 'Database connection error. Please try again later.',
        error: error.message 
      });
    }
    
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

// Get hero section (public route) - MUST come before /:id route
router.get('/hero', async (req, res) => {
  try {
    // Add caching headers
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    
    let hero = await HeroSection.findOne({ isActive: true }).lean();
    
    if (!hero) {
      // Return default hero if none exists
      hero = {
        title: 'Discover Scents That Tell Your Story',
        subtitle: 'Let your presence linger beautifully. Explore our handcrafted fragrances designed to match every personality.',
        backgroundImage: '',
        heroDesktopMediaType: 'image',
        heroDesktopImageUrl: '',
        heroDesktopVideoUrl: '',
        heroMobileMediaType: 'image',
        heroMobileImageUrl: '',
        heroMobileVideoUrl: '',
        primaryButtonText: 'Shop Now',
        secondaryButtonText: 'Explore Collection',
        isActive: true,
      };
    }
    
    res.json(hero);
  } catch (error) {
    console.error('Error fetching hero:', error);
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

// Get product by slug or ID (only if visible) - MUST come last
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const key = String(idOrSlug || '').toLowerCase();
    let product = null;

    const looksLikeObjectId =
      mongoose.Types.ObjectId.isValid(idOrSlug) &&
      String(new mongoose.Types.ObjectId(idOrSlug)) === idOrSlug;

    if (looksLikeObjectId) {
      product = await Product.findOne({ _id: idOrSlug, isVisible: true });
    }
    if (!product) {
      product = await Product.findOne({ slug: key, isVisible: true });
    }
    // Fallback for products not yet backfilled with slug: match slugified name
    if (!product) {
      const candidates = await Product.find({ isVisible: true });
      product =
        candidates.find(
          (p) => slugify(p.name) === key || (p.slug && p.slug === key)
        ) || null;
    }
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

