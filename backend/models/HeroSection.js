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
  /** 'image' | 'video' — desktop hero (recommended 1920×900) */
  heroDesktopMediaType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image',
  },
  heroDesktopImageUrl: { type: String, default: '' },
  heroDesktopVideoUrl: { type: String, default: '' },
  /** 'image' | 'video' — mobile hero (recommended 800×900) */
  heroMobileMediaType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image',
  },
  heroMobileImageUrl: { type: String, default: '' },
  heroMobileVideoUrl: { type: String, default: '' },
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

