# Quick Setup Guide

## 🚀 Getting Started

### Step 1: Install Dependencies

```bash
npm run install-all
```

This will install dependencies for:
- Root project (concurrently for running both servers)
- Backend (Express, MongoDB, etc.)
- Frontend (React, Vite, etc.)

### Step 2: Set Up Environment Variables

1. Navigate to the `backend` folder
2. Create a `.env` file (copy from `.env.example` if it exists, or create new)
3. Add the following:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mistiq-perfumeries
NODE_ENV=development
```

**Note:** If your MongoDB is running on a different port or URI, update `MONGODB_URI` accordingly.

### Step 3: Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
# If MongoDB is installed as a service, it should start automatically
# Or start manually:
mongod
```

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Step 4: Seed the Database

Run the seed script to populate the database with the 5 perfumes:

```bash
cd backend
npm run seed
```

You should see:
```
✅ Connected to MongoDB
🗑️  Cleared existing products
✅ Seeded products successfully
```

### Step 5: Add Images

Before running the app, you need to add images. See `frontend/public/IMAGES_README.md` for details.

**Minimum required:**
- At least add placeholder images so the site doesn't show broken images
- The hero video can be added later (the section will still work without it)

### Step 6: Run the Application

From the root directory:

```bash
npm run dev
```

This will start:
- **Backend server** on http://localhost:5000
- **Frontend dev server** on http://localhost:3000

Open http://localhost:3000 in your browser!

## 📁 Project Structure

```
Mistiq/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── scripts/         # Seed scripts
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── public/          # Static assets (images, videos)
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   └── package.json
└── package.json         # Root package.json
```

## 🎨 Features Implemented

✅ Hero section with video background  
✅ Circular rotating slider (auto-rotates every 3 seconds)  
✅ Bidirectional moving text marquee  
✅ Split section with fade-in animations  
✅ Product showcase with 5 perfumes  
✅ Voting system (fully functional)  
✅ Product detail pages  
✅ Responsive design  
✅ Dark luxury theme  
✅ Smooth animations  

## 🐛 Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check the connection string in `.env`
- Try: `mongosh` to test MongoDB connection

### Port Already in Use
- Change `PORT` in `backend/.env`
- Change port in `frontend/vite.config.js`

### Images Not Showing
- Check file paths in `frontend/public/`
- Ensure image names match exactly (case-sensitive)
- Check browser console for 404 errors

### CORS Errors
- Backend CORS is configured to allow all origins in development
- If issues persist, check `backend/server.js` CORS settings

## 📝 Next Steps

1. Add all required images (see `frontend/public/IMAGES_README.md`)
2. Customize content and branding
3. Add authentication (currently UI only)
4. Implement shopping cart functionality
5. Add payment integration
6. Deploy to production

## 🎯 Development Commands

```bash
# Run both frontend and backend
npm run dev

# Run only backend
npm run server

# Run only frontend
npm run client

# Seed database
cd backend && npm run seed
```

---

**Happy coding! 🚀**

