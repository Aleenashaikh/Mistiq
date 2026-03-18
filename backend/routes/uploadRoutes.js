import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { authenticate, isAdmin } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Validate Cloudinary credentials
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('❌ Cloudinary credentials missing! Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env file');
}

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

// Configure multer with Cloudinary storage for images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'mistiq-perfumes/images', // Folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      {
        width: 800,
        height: 800,
        crop: 'limit',
        quality: 'auto',
      },
    ],
  },
});

// Configure multer with Cloudinary storage for videos
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'mistiq-perfumes/videos', // Folder in Cloudinary
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'webm', 'mkv'],
    transformation: [
      {
        quality: 'auto',
      },
    ],
  },
});

const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) return cb(null, true);
  cb(new Error('Only image files are allowed! (jpg, jpeg, png, gif, webp)'));
};

const videoFileFilter = (req, file, cb) => {
  const allowedTypes = /mp4|mov|avi|webm|mkv/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) return cb(null, true);
  cb(new Error('Only video files are allowed! (mp4, mov, avi, webm, mkv)'));
};

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFileFilter,
});

const videoUpload = multer({
  storage: videoStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: videoFileFilter,
});

/** Hero desktop image — target frame 1920×900, stored without cropping (limit) */
const heroDesktopImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'mistiq-perfumes/hero/desktop',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1920, height: 900, crop: 'limit', quality: 'auto' }],
  },
});

/** Hero mobile image — target frame 800×900 */
const heroMobileImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'mistiq-perfumes/hero/mobile',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 800, height: 900, crop: 'limit', quality: 'auto' }],
  },
});

const heroDesktopVideoStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'mistiq-perfumes/hero/desktop-video',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'webm', 'mkv'],
    transformation: [{ quality: 'auto' }],
  },
});

const heroMobileVideoStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'mistiq-perfumes/hero/mobile-video',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'webm', 'mkv'],
    transformation: [{ quality: 'auto' }],
  },
});

const heroDesktopImageUpload = multer({
  storage: heroDesktopImageStorage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: imageFileFilter,
});

const heroMobileImageUpload = multer({
  storage: heroMobileImageStorage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: imageFileFilter,
});

const heroDesktopVideoUpload = multer({
  storage: heroDesktopVideoStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: videoFileFilter,
});

const heroMobileVideoUpload = multer({
  storage: heroMobileVideoStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: videoFileFilter,
});

function cloudinaryCheck(res) {
  if (!cloudName || !apiKey || !apiSecret) {
    res.status(500).json({ message: 'Cloudinary not configured. Please add credentials to .env file' });
    return false;
  }
  return true;
}

// Hero desktop image (1920×900 frame, limit crop)
router.post('/hero-image-desktop', authenticate, isAdmin, heroDesktopImageUpload.single('image'), async (req, res) => {
  try {
    if (!cloudinaryCheck(res)) return;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    res.json({ success: true, imagePath: req.file.path, message: 'Desktop hero image uploaded' });
  } catch (error) {
    console.error('Hero desktop image upload error:', error);
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
});

router.post('/hero-image-mobile', authenticate, isAdmin, heroMobileImageUpload.single('image'), async (req, res) => {
  try {
    if (!cloudinaryCheck(res)) return;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    res.json({ success: true, imagePath: req.file.path, message: 'Mobile hero image uploaded' });
  } catch (error) {
    console.error('Hero mobile image upload error:', error);
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
});

router.post('/hero-video-desktop', authenticate, isAdmin, heroDesktopVideoUpload.single('video'), async (req, res) => {
  try {
    if (!cloudinaryCheck(res)) return;
    if (!req.file) return res.status(400).json({ message: 'No video uploaded' });
    res.json({ success: true, videoPath: req.file.path, message: 'Desktop hero video uploaded' });
  } catch (error) {
    console.error('Hero desktop video upload error:', error);
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
});

router.post('/hero-video-mobile', authenticate, isAdmin, heroMobileVideoUpload.single('video'), async (req, res) => {
  try {
    if (!cloudinaryCheck(res)) return;
    if (!req.file) return res.status(400).json({ message: 'No video uploaded' });
    res.json({ success: true, videoPath: req.file.path, message: 'Mobile hero video uploaded' });
  } catch (error) {
    console.error('Hero mobile video upload error:', error);
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
});

// Upload product image (admin only)
router.post('/product-image', authenticate, isAdmin, imageUpload.single('image'), async (req, res) => {
  try {
    if (!cloudinaryCheck(res)) return;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Cloudinary returns the URL in req.file.path
    const imageUrl = req.file.path; // This is the Cloudinary URL
    
    res.json({ 
      success: true, 
      imagePath: imageUrl, // Full Cloudinary URL (e.g., https://res.cloudinary.com/...)
      message: 'Image uploaded successfully to Cloudinary' 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message || 'Error uploading image' });
  }
});

// Upload video (admin only)
router.post('/product-video', authenticate, isAdmin, videoUpload.single('video'), async (req, res) => {
  try {
    if (!cloudinaryCheck(res)) return;

    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }
    
    // Cloudinary returns the URL in req.file.path
    const videoUrl = req.file.path; // This is the Cloudinary video URL
    
    res.json({ 
      success: true, 
      videoPath: videoUrl, // Full Cloudinary URL (e.g., https://res.cloudinary.com/...)
      message: 'Video uploaded successfully to Cloudinary' 
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ message: error.message || 'Error uploading video' });
  }
});

export default router;
