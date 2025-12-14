import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Settings from '../models/Settings.js';
import { authenticate } from '../middleware/auth.js';
import { sendOrderNotificationToAdmin, sendOrderConfirmationToCustomer } from '../services/emailService.js';

const router = express.Router();

// Create order (no authentication required)
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod = 'COD' } = req.body;
    
    // Validate items and check stock
    let totalAmount = 0;
    const settings = await Settings.getSettings();
    const DELIVERY_CHARGE = settings.deliveryCharge;
    
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product} not found` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }
      
      totalAmount += item.price * item.quantity;
    }
    
    totalAmount += DELIVERY_CHARGE; // Add delivery charge
    
    // Try to get user from token if provided, otherwise null
    let userId = null;
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const jwt = (await import('jsonwebtoken')).default;
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        userId = decoded.userId;
      }
    } catch (error) {
      // No user, continue without user
    }
    
    // Generate order number first
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let orderNumber = '';
    let isUnique = false;
    
    // Keep generating until we get a unique order number
    while (!isUnique) {
      orderNumber = '';
      for (let i = 0; i < 6; i++) {
        orderNumber += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      // Check if this order number already exists
      const existingOrder = await Order.findOne({ orderNumber });
      if (!existingOrder) {
        isUnique = true;
      }
    }
    
    // Create order
    const order = new Order({
      orderNumber, // Set it explicitly
      items,
      shippingAddress,
      totalAmount,
      paymentMethod: 'COD', // Always COD
      paymentStatus: 'pending',
      status: 'pending',
      user: userId || undefined, // Optional user
    });
    
    await order.save();
    
    // Decrease stock for each product
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }
    
    // Populate order for email
    await order.populate('items.product');
    if (userId) {
      await order.populate('user', 'email');
    }
    
    // Send emails
    await sendOrderNotificationToAdmin(order);
    await sendOrderConfirmationToCustomer(order, order.shippingAddress.email || order.user?.email);
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get user's orders
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name bottleImage price')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single order (user's own order)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

