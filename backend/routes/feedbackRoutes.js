import express from 'express';
import Feedback from '../models/Feedback.js';
import { sendFeedbackNotificationToAdmin } from '../services/emailService.js';

const router = express.Router();

// Get all visible feedbacks (public route)
router.get('/', async (req, res) => {
  try {
    const { minStars } = req.query;
    let query = { isVisible: true };
    
    // Filter by minimum stars if provided (default to 3, 4, or 5 stars)
    if (minStars) {
      query.stars = { $gte: parseInt(minStars) };
    } else {
      // Default to 3, 4, or 5 stars
      query.stars = { $gte: 3 };
    }
    
    console.log('Fetching feedbacks with query:', JSON.stringify(query));
    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 });
    
    console.log(`Found ${feedbacks.length} feedbacks`);
    console.log('Feedbacks:', feedbacks.map(f => ({ name: f.name, stars: f.stars, visible: f.isVisible })));
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ message: error.message });
  }
});

// Submit feedback (public route)
router.post('/', async (req, res) => {
  try {
    const { name, email, stars, comments, product } = req.body;
    
    // Validation
    if (!name || !email || !stars || !comments) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (stars < 1 || stars > 5) {
      return res.status(400).json({ message: 'Stars must be between 1 and 5' });
    }
    
    const feedback = new Feedback({
      name,
      email,
      stars: parseInt(stars),
      comments,
      product: product || '',
    });
    
    await feedback.save();
    
    // Send email notification to admin
    await sendFeedbackNotificationToAdmin(feedback);
    
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get feedback by ID (public route)
router.get('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findOne({ _id: req.params.id, isVisible: true });
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

