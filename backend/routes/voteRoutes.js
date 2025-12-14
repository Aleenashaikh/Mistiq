import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Vote for a product
router.post('/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.votes += 1;
    await product.save();

    res.json({ 
      success: true, 
      votes: product.votes,
      message: 'Vote recorded successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

