# Images Setup Guide

## Required Images

You need to add **12 images** total to make the website fully functional.

### Directory Structure

Create the following directories in `frontend/public/`:

```
frontend/public/
├── videos/
│   └── perfume-hero.mp4
├── images/
│   ├── split-section.jpg
│   ├── perfumes/
│   │   ├── la-fleure.jpg
│   │   ├── belle-aura.jpg
│   │   ├── inferno.jpg
│   │   ├── valiant.jpg
│   │   ├── magnus-noir.jpg
│   │   └── placeholder.jpg
│   └── slider/
│       ├── slide1.jpg
│       ├── slide2.jpg
│       ├── slide3.jpg
│       ├── slide4.jpg
│       └── slide5.jpg
```

### Image Specifications

#### 1. Hero Video (`videos/perfume-hero.mp4`)
- **Purpose:** Background video for hero section
- **Style:** Luxury perfume smoke, slow-motion, elegant atmosphere
- **Format:** MP4
- **Resolution:** 1920x1080 or higher
- **Duration:** 10-30 seconds (will loop)
- **Suggestions:** Search for "luxury perfume smoke" or "perfume slow motion" on stock video sites

#### 2. Split Section Image (`images/split-section.jpg`)
- **Purpose:** Left side of split section
- **Style:** Luxury perfume bottle arrangement, elegant setup
- **Format:** JPG/PNG
- **Resolution:** 1200x800 or higher
- **Suggestions:** Professional perfume photography, dark background

#### 3. Perfume Bottle Images (`images/perfumes/`)
- **Purpose:** Product images for each perfume
- **Style:** Professional product photography
- **Format:** JPG/PNG
- **Resolution:** 800x1200 (portrait orientation)
- **Files:**
  - `la-fleure.jpg` - Pink themed, feminine
  - `belle-aura.jpg` - Purple themed, elegant
  - `inferno.jpg` - Gold themed, bold
  - `valiant.jpg` - Gold themed, dynamic
  - `magnus-noir.jpg` - Gold themed, sophisticated
  - `placeholder.jpg` - Fallback image

#### 4. Circular Slider Images (`images/slider/`)
- **Purpose:** Images for the rotating circular slider
- **Style:** Luxury perfume scenes, elegant compositions
- **Format:** JPG/PNG
- **Resolution:** 1000x1000 (square recommended)
- **Files:**
  - `slide1.jpg` - Should complement La Fleure
  - `slide2.jpg` - Should complement Belle Aura
  - `slide3.jpg` - Should complement Inferno
  - `slide4.jpg` - Should complement Valiant
  - `slide5.jpg` - Should complement Magnus Noir

### Where to Find Images

**Free Stock Photo/Video Sites:**
- Unsplash (unsplash.com) - Search: "perfume", "luxury perfume", "fragrance"
- Pexels (pexels.com) - Search: "perfume bottle", "perfume smoke"
- Pixabay (pixabay.com) - Search: "perfume", "fragrance"
- Pexels Videos - For hero video

**Tips:**
- Use dark, moody images that match the luxury aesthetic
- Ensure images are high resolution
- Consider using AI image generators for consistent style
- All images should complement the black/gold color scheme

### Quick Setup

If you want to test the site without all images, you can:
1. Use placeholder images from placeholder.com or similar
2. The site will still function, but some sections may show broken images
3. Replace with actual images as you find them

### Image Optimization

Before adding images:
- Compress images to reduce file size (use tools like TinyPNG)
- Ensure hero video is optimized for web
- Consider using WebP format for better performance (update code if needed)

