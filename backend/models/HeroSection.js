import mongoose from 'mongoose';

const heroSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  backgroundImage: {
    type: String,
    default: '',
  },
  backgroundVideo: {
    type: String,
    default: '',
  },
  primaryButtonText: {
    type: String,
    default: 'Shop Now',
  },
  secondaryButtonText: {
    type: String,
    default: 'Explore Collection',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('HeroSection', heroSectionSchema);

