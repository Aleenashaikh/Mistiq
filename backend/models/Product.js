import mongoose from 'mongoose';
import { ensureUniqueProductSlug, slugify } from '../utils/slugify.js';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  /** Human-readable URL slug, e.g. "morgan" → /products/morgan */
  slug: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true,
    index: true,
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

// Auto-generate a unique slug from the product name when missing or name changed
productSchema.pre('validate', async function (next) {
  try {
    if (!this.name) return next();

    if (this.isModified('slug') && this.slug) {
      const base = slugify(this.slug) || slugify(this.name);
      this.slug = await ensureUniqueProductSlug(this.constructor, base, this._id || null);
    } else if (!this.slug || this.isModified('name')) {
      this.slug = await ensureUniqueProductSlug(
        this.constructor,
        this.name,
        this._id || null
      );
    }
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model('Product', productSchema);

