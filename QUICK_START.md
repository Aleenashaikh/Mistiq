# 🚀 Quick Start Guide - How to Run Mistiq Perfumeries

## Prerequisites
- Node.js installed (v16 or higher)
- MongoDB installed and running

## Step-by-Step Instructions

### 1️⃣ Install Dependencies (Already Done ✅)
Dependencies are already installed! You can skip this step.

If you need to reinstall:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2️⃣ Set Up Environment Variables

Create a `.env` file in the `backend` folder:

**Windows PowerShell:**
```powershell
cd backend
@"
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mistiq-perfumeries
NODE_ENV=development
"@ | Out-File -FilePath .env -Encoding utf8
```

**Or manually create `backend/.env` with:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mistiq-perfumeries
NODE_ENV=development
```

### 3️⃣ Start MongoDB

**Option A: If MongoDB is installed as a Windows Service**
- It should start automatically
- Check if it's running in Services (services.msc)

**Option B: Start MongoDB manually**
```bash
# Navigate to MongoDB bin directory (usually):
cd "C:\Program Files\MongoDB\Server\<version>\bin"
mongod
```

**Option C: Using MongoDB Compass**
- Open MongoDB Compass
- It will start MongoDB automatically

**Verify MongoDB is running:**
```bash
mongosh
# Or
mongo
```

### 4️⃣ Seed the Database

Run this command to populate the database with the 5 perfumes:

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

### 5️⃣ Run the Application

**From the root directory (`C:\projects\Mistiq`):**

```bash
npm run dev
```

This will start:
- **Backend API** → http://localhost:5000
- **Frontend App** → http://localhost:3000

**Or run separately:**

**Terminal 1 (Backend):**
```bash
npm run server
```

**Terminal 2 (Frontend):**
```bash
npm run client
```

### 6️⃣ Open in Browser

Open http://localhost:3000 in your browser!

---

## 🐛 Troubleshooting

### MongoDB Connection Error

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
1. Make sure MongoDB is running
2. Check if MongoDB is on the default port (27017)
3. Try: `mongosh` to test connection
4. If using a different MongoDB URI, update `backend/.env`

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
- Change `PORT=5000` to `PORT=5001` in `backend/.env`
- Or kill the process using port 5000

### Images Not Showing

The site will work without images, but some sections may show broken image icons. Add images to `frontend/public/` as described in `frontend/public/IMAGES_README.md`.

### Module Not Found Errors

If you see module errors:
```bash
# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install
```

---

## ✅ Success Indicators

When everything is working, you should see:

**Backend:**
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

**Frontend:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**Browser:**
- Homepage loads with hero section
- Products are displayed
- Voting buttons work
- No console errors

---

## 📝 Next Steps After Running

1. **Add Images** - See `frontend/public/IMAGES_README.md`
2. **Test Features:**
   - Click "Vote for this fragrance" on products
   - Navigate between pages
   - Check responsive design on mobile

---

## 🎯 Quick Commands Reference

```bash
# Install all dependencies
npm install
cd backend && npm install && cd ../frontend && npm install

# Seed database
cd backend && npm run seed

# Run everything
npm run dev

# Run backend only
npm run server

# Run frontend only
npm run client
```

---

**Need help?** Check the main `README.md` for more details!

