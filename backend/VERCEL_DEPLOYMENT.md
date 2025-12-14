# Vercel Deployment Guide

Your backend has been prepared for Vercel deployment. Follow these steps to deploy:

## ✅ Files Created/Modified

1. **`vercel.json`** - Vercel configuration
2. **`index.js`** - Vercel entry point (exports the Express app)
3. **`server.js`** - Modified to work with serverless (removed `app.listen()`)
4. **`package.json`** - Updated with `main: "index.js"`

## 🚀 Deployment Steps

### 1. Push to GitHub
```bash
git add backend/
git commit -m "Prepare backend for Vercel deployment"
git push
```

### 2. Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click **"New Project"** → **"Import Git Repository"**
3. Select your repository
4. **Important Settings:**
   - **Root Directory**: `backend` (not the root!)
   - **Framework Preset**: Leave as "Other" or "None"
   - **Build Command**: (leave empty or `npm install`)
   - **Output Directory**: (leave empty)
   - **Install Command**: `npm install`

### 3. Add Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

**Required:**
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Your JWT secret key

**Optional (if using these services):**
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `EMAIL_USER` - For nodemailer
- `EMAIL_PASS` - For nodemailer
- Any other variables from your `.env` file

### 4. Deploy

Click **"Deploy"** and wait for the build to complete.

## 🧪 Testing

After deployment, test these endpoints:

- `https://your-app.vercel.app/api/health`
- `https://your-app.vercel.app/api/products`
- `https://your-app.vercel.app/api/admin/settings`

## ⚠️ Important Notes

1. **MongoDB Connection**: The code now handles serverless connections properly with connection reuse.

2. **Cold Starts**: First request may be slower (~1-2 seconds) while MongoDB connects. Subsequent requests will be faster.

3. **Timeout Limits**: 
   - Vercel Free: 10 seconds
   - Vercel Pro: 60 seconds
   - Consider upgrading if you have long-running operations

4. **Local Development**: Your local development still works! The code detects if it's running on Vercel (`process.env.VERCEL`) and behaves accordingly.

5. **File Uploads**: If using Cloudinary, ensure your environment variables are set correctly.

## 🔧 Troubleshooting

**404 Errors:**
- Check that Root Directory is set to `backend`
- Verify `vercel.json` exists in the backend folder

**MongoDB Connection Errors:**
- Verify `MONGODB_URI` is set in Vercel environment variables
- Check MongoDB Atlas allows connections from Vercel IPs (or use 0.0.0.0/0 for all IPs)

**Function Timeout:**
- Check Vercel logs for timeout errors
- Consider optimizing slow routes
- Upgrade to Vercel Pro for longer timeouts

## 📝 Next Steps

1. Update your frontend `.env` file to point to the Vercel backend URL:
   ```
   VITE_API_TARGET=https://your-backend.vercel.app
   ```

2. Test all API endpoints to ensure everything works

3. Monitor Vercel logs for any errors

