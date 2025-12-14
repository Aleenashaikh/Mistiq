# Admin Portal Setup Guide

## 🚀 Quick Setup

### 1. Install Dependencies
All dependencies are already installed. If needed:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Set Up Environment Variables

Create `backend/.env` file with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mistiq-perfumeries
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EMAIL_USER=mistiqperfumeries@gmail.com
EMAIL_PASS=your-gmail-app-password-here
```

**Important:** For email functionality, you need to:
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use that App Password in `EMAIL_PASS`

### 3. Seed Admin User

Run the seed script to create the admin user:
```bash
cd backend
npm run seed-admin
```

**Admin Credentials:**
- Username: `Hamza@123`
- Password: `Has81110`
- Email: `mistiqperfumeries@gmail.com`

### 4. Seed Products (Optional)

If you haven't already:
```bash
cd backend
npm run seed
```

### 5. Start the Application

```bash
npm run dev
```

## 🔐 Admin Portal Features

### Access
- URL: http://localhost:3000/admin/dashboard
- Login with admin credentials
- Regular users will be redirected to home page

### Features Available:

1. **Dashboard** (`/admin/dashboard`)
   - Overview statistics
   - Quick access to all sections

2. **Inventory Management** (`/admin/inventory`)
   - Add new products
   - Edit existing products (name, description, images, price, etc.)
   - Delete products
   - View all products in a table

3. **Order Management** (`/admin/orders`)
   - View all orders
   - Filter by status (pending, processing, shipped, delivered, cancelled)
   - Filter by date range
   - Filter by customer
   - Update order status
   - Export orders to Excel

4. **Analytics** (`/admin/analytics`)
   - Total orders and revenue
   - Orders by status
   - Orders by date (for charts)
   - Top selling products
   - Date range filtering
   - Export to Excel

5. **Hero Section Editor** (`/admin/hero`)
   - Edit hero title and subtitle
   - Update background image/video URLs
   - Change button texts

## 📧 Email Configuration

### Order Notifications
- When an order is placed, admin receives email at `mistiqperfumeries@gmail.com`
- Customer receives confirmation email

### Email Setup Steps:
1. Go to Google Account settings
2. Enable 2-Step Verification
3. Generate App Password: https://myaccount.google.com/apppasswords
4. Select "Mail" and "Other (Custom name)"
5. Copy the generated password
6. Paste it in `backend/.env` as `EMAIL_PASS`

## 🔒 Security Features

- Role-based access control (admin vs user)
- JWT token authentication
- Protected routes (admin portal only accessible to admins)
- LocalStorage stores user role for quick checks
- Server-side validation for all admin actions

## 🗄️ Database Collections

The following collections are created:
- `users` - User accounts (admin and regular users)
- `products` - Product inventory
- `orders` - Customer orders
- `herosections` - Hero section content

## 🧪 Testing

1. **Login as Admin:**
   - Go to http://localhost:3000/login
   - Username: `Hamza@123`
   - Password: `Has81110`
   - Should redirect to `/admin/dashboard`

2. **Login as Regular User:**
   - Register a new account
   - Login
   - Should redirect to home page
   - Cannot access `/admin/*` routes

3. **Test Admin Features:**
   - Add a product
   - Edit a product
   - View orders
   - Check analytics
   - Edit hero section

## 📝 Notes

- Admin user is created with role `admin`
- Regular users default to role `user`
- All admin routes require authentication + admin role
- Email functionality requires proper Gmail App Password setup
- Excel export uses XLSX library

## 🐛 Troubleshooting

### Cannot access admin portal
- Check if logged in as admin
- Verify role in localStorage: `localStorage.getItem('role')` should be `admin`
- Check browser console for errors

### Email not sending
- Verify `EMAIL_PASS` in `.env` is correct (App Password, not regular password)
- Check Gmail account has 2FA enabled
- Check server logs for email errors

### Products not showing
- Run seed script: `npm run seed`
- Check MongoDB connection
- Verify products collection exists

---

**Admin Portal is ready to use!** 🎉

