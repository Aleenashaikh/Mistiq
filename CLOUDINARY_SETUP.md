# Cloudinary Setup Guide

## Step 1: Create a Free Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Click "Sign Up" (it's free!)
3. Fill in your details and verify your email

## Step 2: Get Your API Credentials

1. After logging in, you'll see your **Dashboard**
2. Copy these three values:
   - **Cloud Name** (e.g., `dabc123`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

## Step 3: Add Credentials to Your .env File

1. Copy `backend/.env.example` to `backend/.env` (if you don't have a `.env` file yet)
2. Add these lines to your `backend/.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Important:** 
- Never commit your `.env` file to git! It contains sensitive credentials.
- Make sure `.env` is in your `.gitignore` file

## Step 4: Restart Your Server

After adding the credentials, restart your backend server:

```bash
cd backend
npm run dev
```

## Benefits of Cloudinary

✅ **Free Tier:** 25GB storage, 25GB bandwidth/month  
✅ **CDN Delivery:** Images load fast from anywhere  
✅ **Auto Optimization:** Images are automatically optimized  
✅ **No Database Space:** Only URLs are stored (not the actual images)  
✅ **Transformations:** Can resize, crop, and format images on-the-fly  

## How It Works

1. Admin uploads an image through the admin portal
2. Image is sent to Cloudinary
3. Cloudinary stores the image and returns a URL
4. The URL (e.g., `https://res.cloudinary.com/your-cloud/image/upload/v1234567890/mistiq-perfumes/product-123.jpg`) is saved to your database
5. Frontend displays the image using this URL

## Example Cloudinary URL Format

```
https://res.cloudinary.com/{cloud_name}/image/upload/v{timestamp}/{folder}/{filename}.{ext}
```

Your images will be stored in the `mistiq-perfumes` folder in your Cloudinary account.

## Troubleshooting

**Error: "Must supply api_key" or "Cloudinary not configured"**
- Make sure you've added all three credentials to your `.env` file:
  ```env
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  ```
- Check that there are no extra spaces or quotes around the values
- Make sure your `.env` file is in the `backend/` directory
- Restart your server after updating `.env`
- Check the server console for error messages about missing credentials

**Error: "Invalid API credentials"**
- Double-check your Cloud Name, API Key, and API Secret in `.env`
- Make sure you copied the correct values from Cloudinary dashboard
- Verify your Cloudinary account is active

**Error: "Upload failed"**
- Check your internet connection
- Verify your Cloudinary account is active
- Check the file size:
  - Images: max 10MB
  - Videos: max 100MB

## Need Help?

Visit [Cloudinary Documentation](https://cloudinary.com/documentation) or check your Cloudinary dashboard for usage statistics.

