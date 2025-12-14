# Troubleshooting Login Error - ECONNRESET

## The Problem
You're getting `[vite] http proxy error: /api/auth/login` with `Error: read ECONNRESET` and being redirected back to login page.

## Common Causes & Solutions

### 1. MongoDB Not Running ⚠️ (Most Likely)

**Check if MongoDB is running:**
```bash
# Windows - Check services
services.msc
# Look for "MongoDB" service

# Or check if port 27017 is in use
netstat -ano | findstr :27017
```

**Start MongoDB:**
- If installed as service: It should start automatically
- If not: Navigate to MongoDB bin folder and run `mongod`
- Or use MongoDB Compass (it starts MongoDB automatically)

### 2. Admin User Not Created

**Create admin user:**
```bash
cd backend
npm run seed-admin
```

You should see:
```
✅ Connected to MongoDB
✅ Admin user created successfully
```

### 3. Backend Server Crashed

**Check backend logs:**
- Look at the terminal where `npm run dev` is running
- Check for MongoDB connection errors
- Check for any other error messages

**Restart backend:**
```bash
# Stop the current process (Ctrl+C)
cd backend
npm run dev
```

### 4. Port Conflicts

**Check if port 5000 is available:**
```bash
netstat -ano | findstr :5000
```

If something else is using it, change PORT in `backend/.env`

### 5. Environment Variables Missing

**Check `backend/.env` file exists and has:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mistiq-perfumeries
JWT_SECRET=your-secret-key-here
```

## Quick Fix Steps

1. **Start MongoDB:**
   ```bash
   # Option 1: Start MongoDB service
   net start MongoDB
   
   # Option 2: Use MongoDB Compass (opens automatically)
   ```

2. **Verify MongoDB connection:**
   ```bash
   mongosh
   # Should connect successfully
   ```

3. **Create admin user:**
   ```bash
   cd backend
   npm run seed-admin
   ```

4. **Restart both servers:**
   ```bash
   # Stop current processes (Ctrl+C)
   npm run dev
   ```

5. **Try logging in again:**
   - Username: `Hamza@123`
   - Password: `Has81110`

## Check Backend Logs

When you try to login, check the backend terminal for:
- ✅ "Connected to MongoDB" message
- ❌ Any error messages
- ❌ "MongoDB connection error"

## Test Backend Directly

Test if backend is responding:
```bash
curl http://localhost:5000/api/health
```

Should return: `{"status":"OK","message":"Mistiq Perfumeries API is running"}`

## Still Not Working?

1. **Check browser console** (F12) for detailed error messages
2. **Check network tab** to see the actual HTTP response
3. **Check backend terminal** for error logs
4. **Verify MongoDB is actually running** and accessible

## Expected Behavior

When login works:
- Backend receives request
- Finds user in database
- Validates password
- Returns token and user data
- Frontend stores token
- Redirects to `/admin/dashboard` (for admin) or `/` (for users)

If any step fails, you'll see an error message.

