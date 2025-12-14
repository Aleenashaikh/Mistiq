# 🚀 Run the Application - Step by Step

## Before Running - Check These First:

### 1. Is MongoDB Running?
Open a new terminal and test:
```bash
mongosh
```
If it connects, MongoDB is running. Type `exit` to leave.

If MongoDB is NOT running:
- **Windows:** Check Services (services.msc) for "MongoDB"
- Or start it manually from MongoDB installation directory

### 2. Seed the Database (One-Time Setup)
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

### 3. Now Run the Application

**Option A: Run Both Servers Together (Recommended)**
```bash
npm run dev
```

**Option B: Run Separately (in 2 terminals)**

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

## What You Should See:

**Backend Output:**
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

**Frontend Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

## Open in Browser:
👉 **http://localhost:3000**

---

## Common Issues:

### ❌ "MongoServerError: connect ECONNREFUSED"
**Fix:** Start MongoDB first (see step 1 above)

### ❌ "Port 5000 already in use"
**Fix:** 
- Close other applications using port 5000
- Or change PORT in `backend/.env` to 5001

### ❌ "Cannot find module"
**Fix:**
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

## Quick Test:
Once running, test the API:
```bash
curl http://localhost:5000/api/health
```

Should return: `{"status":"OK","message":"Mistiq Perfumeries API is running"}`

