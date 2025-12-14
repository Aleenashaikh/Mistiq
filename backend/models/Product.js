import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Unisex'],
  },
  impressionOf: {
    type: String,
    required: true,
  },
  topNotes: {
    type: [String],
    default: [],
  },
  heartNotes: {
    type: [String],
    default: [],
  },
  baseNotes: {
    type: [String],
    default: [],
  },
  bottleImage: {
    type: String,
    required: true,
  },
  hoverImage: {
    type: String,
    default: '',
  },
  thirdImage: {
    type: String,
    default: '',
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  themeColor: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  votes: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: '',
  },
  actualPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  discountedPrice: {
    type: Number,
    default: null,
    min: 0,
  },
  price: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Product', productSchema);

