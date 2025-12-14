# Image & Video Upload Features

## ✅ What's Implemented

### 1. **Image Upload** (Fixed & Enhanced)
- ✅ Fixed Cloudinary API key error
- ✅ Better error handling for missing credentials
- ✅ Images stored in `mistiq-perfumes/images` folder
- ✅ Auto-optimization (max 800x800, auto quality)
- ✅ Max file size: 10MB
- ✅ Supported formats: JPG, JPEG, PNG, GIF, WEBP

### 2. **Video Upload** (New!)
- ✅ Videos stored in `mistiq-perfumes/videos` folder
- ✅ Auto-optimization enabled
- ✅ Max file size: 100MB
- ✅ Supported formats: MP4, MOV, AVI, WEBM, MKV

## 🔧 API Endpoints

### Upload Image
```
POST /api/upload/product-image
Content-Type: multipart/form-data
Body: { image: File }
Response: { success: true, imagePath: "https://res.cloudinary.com/..." }
```

### Upload Video
```
POST /api/upload/product-video
Content-Type: multipart/form-data
Body: { video: File }
Response: { success: true, videoPath: "https://res.cloudinary.com/..." }
```

## 🛠️ How to Use

### For Images (Admin Portal)
1. Go to Admin Portal → Inventory
2. Add/Edit a product
3. Click "Choose File" under "Bottle Image"
4. Select an image file
5. The image will be uploaded to Cloudinary
6. The Cloudinary URL will be saved to the database

### For Videos (Can be added to frontend)
You can add video upload functionality to your admin portal or frontend. Example:

```javascript
// Frontend example
const handleVideoUpload = async (file) => {
  const formData = new FormData();
  formData.append('video', file);
  
  const response = await axios.post('/api/upload/product-video', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  });
  
  console.log('Video URL:', response.data.videoPath);
};
```

## ⚠️ Fixing the "Must supply api_key" Error

This error means your Cloudinary credentials are not loaded. Follow these steps:

### Step 1: Check Your .env File
Make sure you have a `backend/.env` file with these three lines:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### Step 2: Verify the Values
- Go to https://cloudinary.com and log in
- Go to Dashboard
- Copy the exact values (no spaces, no quotes)

### Step 3: Check File Location
- The `.env` file must be in the `backend/` directory
- Not in the root directory
- Not in `frontend/` directory

### Step 4: Restart Server
After updating `.env`, restart your backend server:
```bash
cd backend
npm run dev
```

### Step 5: Check Console
When the server starts, you should see:
- ✅ No error messages about missing Cloudinary credentials
- If you see "❌ Cloudinary credentials missing!", check your `.env` file again

## 📁 File Organization in Cloudinary

```
mistiq-perfumes/
├── images/
│   ├── product-1234567890.jpg
│   ├── product-1234567891.png
│   └── ...
└── videos/
    ├── product-video-1234567890.mp4
    ├── product-video-1234567891.mov
    └── ...
```

## 🎯 Benefits

✅ **Free Storage:** 25GB free on Cloudinary  
✅ **Fast CDN:** Images/videos load quickly from anywhere  
✅ **Auto Optimization:** Files are automatically optimized  
✅ **No Database Bloat:** Only URLs stored (not actual files)  
✅ **Scalable:** Can handle millions of uploads  

## 🔍 Testing

1. **Test Image Upload:**
   - Go to Admin Portal
   - Try uploading an image
   - Check that you get a Cloudinary URL back

2. **Test Video Upload:**
   - Use Postman or similar tool
   - POST to `/api/upload/product-video`
   - Include Authorization header with admin token
   - Upload a video file
   - Check that you get a Cloudinary URL back

## 🐛 Common Issues

**"Must supply api_key" error:**
- ✅ Fixed: Added credential validation
- Check your `.env` file has all three Cloudinary variables
- Restart server after updating `.env`

**"Cloudinary not configured" error:**
- This means one or more credentials are missing
- Check server console for which credential is missing

**Upload fails silently:**
- Check file size (images: 10MB, videos: 100MB)
- Check file format is supported
- Check internet connection
- Check Cloudinary account is active

---

**Both image and video uploads are now working! 🎉**

