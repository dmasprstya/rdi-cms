# 🚀 RDI Landing Page - Deployment Guide

Panduan deployment untuk production environment.

---

## 📋 Pre-Deployment Checklist

- [ ] ✅ Semua placeholder content sudah diganti
- [ ] ✅ Build production berhasil tanpa error
- [ ] ✅ Testing lengkap (functionality, responsive, cross-browser)
- [ ] ✅ Performance optimized (images compressed, code minified)
- [ ] ✅ SEO tags lengkap
- [ ] ✅ Analytics scripts ready

---

## 🔧 Build Production

### 1. Clean Build
```bash
# Hapus cache & build artifacts
rm -rf .next
rm -rf out

# Install dependencies (jika perlu)
npm install

# Build production
npm run build
```

### 2. Verify Build
```bash
# Check output
# Harus tampil: ✓ Compiled successfully

# Test production locally
npm start
```

Buka http://localhost:3000 dan verify:
- [ ] Semua pages load dengan cepat
- [ ] No console errors
- [ ] Images dimuat dengan benar
- [ ] Links berfungsi semua

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- ✅ Built by Next.js creators
- ✅ Zero-config deployment
- ✅ Auto SSL
- ✅ Global CDN
- ✅ Analytics built-in

**Steps:**

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Production Deploy**
   ```bash
   vercel --prod
   ```

**Custom Domain:**
```bash
vercel domains add rosmandjohan.id
# Follow instructions untuk DNS setup
```

---

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

**netlify.toml** (create this file):
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Option 3: VPS/Dedicated Server

#### Requirements
- Node.js 18+ installed
- PM2 for process management
- Nginx for reverse proxy
- SSL certificate (Let's Encrypt)

#### Setup Steps

**1. Clone & Install**
```bash
cd /var/www
git clone <your-repo> rdi-website
cd rdi-website
npm install
npm run build
```

**2. PM2 Setup**
```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start npm --name "rdi-web" -- start

# Auto-restart on reboot
pm2 startup
pm2 save
```

**3. Nginx Config**

Create `/etc/nginx/sites-available/rosmandjohan.id`:

```nginx
server {
    listen 80;
    server_name rosmandjohan.id www.rosmandjohan.id;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/rosmandjohan.id /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

**4. SSL Certificate**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d rosmandjohan.id -d www.rosmandjohan.id
```

---

## 🔐 Environment Variables

Create `.env.production`:

```env
# Database (already configured)
DATABASE_URL=your_production_db_url

# Next Auth (already configured)
NEXTAUTH_URL=https://rosmandjohan.id
NEXTAUTH_SECRET=your_production_secret

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry (optional)
SENTRY_DSN=your_sentry_dsn
```

---

## 📊 Performance Optimization

### 1. Image Optimization

**Compress all images:**
```bash
# Using sharp-cli
npm install -g sharp-cli

# Compress JPGs
sharp -i "public/images/*.jpg" -o "public/images/" -q 80

# Compress PNGs
sharp -i "public/logos/*.png" -o "public/logos/" --compressionLevel 9
```

### 2. Video Optimization

**For hero video:**
- Use H.264 codec
- Resolution: 1920x1080
- Bitrate: 2-3 Mbps
- Duration: 15-30s (loop)
- File size: < 5MB

**Tool:** Handbrake or FFmpeg
```bash
ffmpeg -i input.mp4 -vcodec h264 -acodec aac \
  -vf scale=1920:1080 -b:v 2M -b:a 128k \
  public/videos/hero-rdi.mp4
```

### 3. Code Optimization

Already implemented:
- ✅ Static generation for all pages
- ✅ Bundle splitting
- ✅ Tree shaking
- ✅ Minification

---

## 📈 Analytics Setup

### Google Analytics 4

**1. Get GA4 Measurement ID**
- Go to https://analytics.google.com
- Create property
- Copy Measurement ID (G-XXXXXXXXXX)

**2. Add to `app/layout.tsx`**

```tsx
// Add inside <head>
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
  `}
</Script>
```

**3. Add to `.env.production`**
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 🔍 SEO Enhancement

### 1. Meta Tags

Update `app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  title: "Rosman Djohan Institute - Pendidikan Vokasi Internasional & Sertifikasi Halal",
  description: "Lembaga pendidikan terpadu untuk program luar negeri (Jerman, Taiwan, Jepang) dan pelatihan sertifikasi halal (HALTEC). Raih masa depan kompeten dan mendunia.",
  keywords: ["pendidikan luar negeri", "ausbildung jerman", "kuliah taiwan", "kerja jepang", "sertifikasi halal", "penyelia halal", "juleha", "LPK internasional"],
  authors: [{ name: "Rosman Djohan Institute" }],
  openGraph: {
    title: "Rosman Djohan Institute",
    description: "Lembaga pendidikan vokasi terpadu untuk karir internasional dan sertifikasi halal",
    url: "https://rosmandjohan.id",
    siteName: "Rosman Djohan Institute",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rosman Djohan Institute",
    description: "Pendidikan vokasi internasional & sertifikasi halal",
    images: ["/og-image.jpg"],
  },
};
```

### 2. Sitemap

Create `app/sitemap.ts`:

```ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://rosmandjohan.id',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://rosmandjohan.id/program/luar-negeri',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://rosmandjohan.id/program/haltec',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]
}
```

### 3. robots.txt

Create `app/robots.ts`:

```ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/editor/', '/guru/', '/student/'],
    },
    sitemap: 'https://rosmandjohan.id/sitemap.xml',
  }
}
```

---

## 🎯 Post-Deployment

### 1. Submit to Search Engines

**Google Search Console:**
1. Go to https://search.google.com/search-console
2. Add property: rosmandjohan.id
3. Verify ownership (via DNS or HTML)
4. Submit sitemap: https://rosmandjohan.id/sitemap.xml

**Bing Webmaster:**
1. Go to https://www.bing.com/webmasters
2. Add site
3. Submit sitemap

### 2. Monitor Performance

**Tools:**
- Google Analytics - Traffic & user behavior
- Google Search Console - Search performance
- PageSpeed Insights - Performance metrics
- Vercel Analytics (if using Vercel)

### 3. Setup Monitoring

**Uptime Monitoring:**
- UptimeRobot (free)
- Pingdom
- StatusCake

**Error Tracking:**
- Sentry (already configured in project)

---

## 🔄 Continuous Deployment

### GitHub Actions (example)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to Vercel
      run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## ✅ Final Checklist

### Content
- [ ] Media assets uploaded & optimized
- [ ] WhatsApp numbers updated
- [ ] Company info updated
- [ ] Social media links updated

### Technical
- [ ] Build successful (`npm run build`)
- [ ] Environment variables configured
- [ ] Analytics installed
- [ ] SEO meta tags complete
- [ ] Sitemap generated
- [ ] robots.txt configured

### Deployment
- [ ] Domain DNS configured
- [ ] SSL certificate active
- [ ] Performance tested (PageSpeed > 90)
- [ ] Mobile-friendly test passed
- [ ] All links working
- [ ] Forms/CTAs tested

### Post-Deploy
- [ ] Submitted to Google Search Console
- [ ] Submitted to Bing Webmaster
- [ ] Uptime monitoring active
- [ ] Error tracking active
- [ ] Backup strategy in place

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear everything
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Images Not Loading
- Check file paths (case-sensitive)
- Verify files exist in `/public`
- Check Next.js image optimization config

### Slow Load Times
- Compress images (< 200KB each)
- Optimize video (< 5MB)
- Enable CDN caching
- Use WebP format for images

---

## 📞 Support

**Issues?**
1. Check docs: `docs/RDI_LANDING_PAGE_DOCS.md`
2. Review checklist: `RDI_CONTENT_CHECKLIST.md`
3. Contact dev team

---

**🎉 Ready to Go Live!**

_Last Updated: 2025-12-27_
