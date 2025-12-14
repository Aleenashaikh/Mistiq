import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: false, // Will be auto-generated in pre-save hook
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  }],
  shippingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    nearestLandmark: String,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'card', 'paypal', 'cash'],
    default: 'COD',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

// Generate order number before saving (6 random alphanumeric characters)
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
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
      const existingOrder = await mongoose.model('Order').findOne({ orderNumber });
      if (!existingOrder) {
        isUnique = true;
      }
    }
    
    this.orderNumber = orderNumber;
  }
  next();
});

export default mongoose.model('Order', orderSchema);

