# Mistiq Perfumeries - Luxury Fragrance Website

A modern, luxury dark-themed MERN stack website for **Mistiq Perfumeries**, targeting Gen-Z perfume lovers with elegant animations and premium design.

## 🚀 Features

- **Hero Section** with video background
- **Circular Rotating Slider** (IdeaBranch style) with auto-rotation
- **Bidirectional Moving Text Marquee** (huge text animations)
- **Split Section** with fade-in animations
- **Product Showcase** with 5 luxury perfumes
- **Voting System** for favorite fragrances
- **Fully Responsive** design
- **Dark Luxury Theme** (Black, Gold, White, Pink/Purple accents)
- **Smooth Animations** using Framer Motion

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Styling:** CSS with custom luxury theme
- **Animations:** Framer Motion

## 📦 Installation

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Set up environment variables:**
   - Copy `backend/.env.example` to `backend/.env`
   - Update MongoDB URI if needed

3. **Start MongoDB:**
   - Make sure MongoDB is running on your system
   - Default connection: `mongodb://localhost:27017/mistiq-perfumeries`

4. **Seed the database:**
   ```bash
   cd backend
   npm run seed
   ```

5. **Run the application:**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🖼️ Required Images

You'll need to add the following images to your project:

### Images Directory Structure:
```
frontend/public/
├── videos/
│   └── perfume-hero.mp4          (Hero background video - luxury perfume smoke/slow-motion)
├── images/
│   ├── split-section.jpg          (Image for split section - luxury perfume scene)
│   ├── perfumes/
│   │   ├── la-fleure.jpg          (La Fleure bottle - pink theme)
│   │   ├── belle-aura.jpg         (Belle Aura bottle - purple theme)
│   │   ├── inferno.jpg            (Inferno bottle - gold theme)
│   │   ├── valiant.jpg            (Valiant bottle - gold theme)
│   │   ├── magnus-noir.jpg        (Magnus Noir bottle - gold theme)
│   │   └── placeholder.jpg        (Fallback image)
│   └── slider/
│       ├── slide1.jpg             (For circular slider - La Fleure)
│       ├── slide2.jpg             (For circular slider - Belle Aura)
│       ├── slide3.jpg             (For circular slider - Inferno)
│       ├── slide4.jpg             (For circular slider - Valiant)
│       └── slide5.jpg             (For circular slider - Magnus Noir)
```

### Image Requirements:

**Total Images Needed: 12**

1. **Hero Video** (`perfume-hero.mp4`)
   - Format: MP4
   - Style: Luxury perfume smoke, slow-motion, elegant
   - Duration: 10-30 seconds (looping)
   - Resolution: 1920x1080 or higher

2. **Split Section Image** (`split-section.jpg`)
   - Format: JPG/PNG
   - Style: Luxury perfume bottle arrangement, elegant setup
   - Resolution: 1200x800 or higher

3. **Perfume Bottle Images** (5 images)
   - Format: JPG/PNG
   - Style: Professional product photography, transparent or dark background
   - Resolution: 800x1200 or higher (portrait orientation)
   - Each should match the perfume's theme color

4. **Circular Slider Images** (5 images)
   - Format: JPG/PNG
   - Style: Luxury perfume scenes, elegant compositions
   - Resolution: 1000x1000 or higher (square recommended)
   - Should complement each perfume

### Image Suggestions:

- Use high-quality stock photos from Unsplash, Pexels, or similar
- Search terms: "luxury perfume", "perfume bottle", "fragrance", "perfume smoke"
- Ensure images match the dark, luxury aesthetic
- Consider using AI-generated images for consistent style

## 🎨 Color Palette

- **Black:** #000000
- **Gold:** #d4af37
- **White:** #f5f5f5
- **Ladies Pink:** #d63384
- **Ladies Purple:** #6f42c1

## 📄 Pages

- **Home** - Hero, animations, product showcase
- **Products** - Browse all fragrances with filters
- **Product Detail** - Individual product pages with notes and voting
- **About** - Brand story and mission
- **Contact** - Contact form and information
- **Cart** - Shopping cart (basic implementation)
- **Checkout** - Checkout form (basic implementation)
- **Login/Signup** - Authentication pages

## 🗄️ Database Schema

### Product Model:
```javascript
{
  name: String,
  gender: String (Male/Female/Unisex),
  impressionOf: String,
  topNotes: [String],
  heartNotes: [String],
  baseNotes: [String],
  bottleImage: String,
  themeColor: String,
  rating: Number,
  votes: Number,
  description: String,
  price: Number
}
```

## 🔌 API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/gender/:gender` - Get products by gender
- `POST /api/vote/:productId` - Vote for a product
- `GET /api/health` - Health check

## 🎯 Features to Implement

- [ ] User authentication (currently UI only)
- [ ] Shopping cart functionality
- [ ] Payment integration
- [ ] Order management
- [ ] Product search
- [ ] User reviews
- [ ] Wishlist feature

## 📝 Notes

- The voting system is fully functional
- All animations are implemented with Framer Motion
- The design is fully responsive
- Content is adapted for "Mistiq Perfumeries" brand

## 🚀 Deployment

For production deployment:
1. Build the frontend: `cd frontend && npm run build`
2. Set production environment variables
3. Deploy backend to a Node.js hosting service
4. Deploy frontend to a static hosting service (Vercel, Netlify, etc.)
5. Update API URLs in frontend for production

---

**Built with ❤️ for Mistiq Perfumeries**

