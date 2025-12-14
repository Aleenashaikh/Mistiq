import express from 'express';
import { sendContactNotificationToAdmin } from '../services/emailService.js';

const router = express.Router();

// Submit contact form (public route)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Send email notification to admin
    await sendContactNotificationToAdmin({ name, email, message });
    
    res.status(200).json({ message: 'Thank you for your message! We will get back to you soon.' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Error sending message. Please try again later.' });
  }
});

export default router;

