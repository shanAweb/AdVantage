# 🚀 cPanel Deployment Guide

## Step 1: ✅ Production Build Complete
- Frontend: Built successfully (Next.js static export)
- Backend: Compiled successfully (TypeScript)
- Build files ready in `/out` and `/dist` folders

## Step 2: Database Setup on cPanel

### 2.1. Create PostgreSQL Database:
1. Login to cPanel
2. Go to **"PostgreSQL Databases"** (or **"MySQL Databases"** if PostgreSQL not available)
3. Create new database: `global_ads_db`
4. Create database user: `global_ads_user`
5. Assign user to database with **ALL PRIVILEGES**
6. Note down: **Database Name**, **Username**, **Password**, **Host** (usually `localhost`)

### 2.2. Alternative - Use MySQL if PostgreSQL unavailable:
- Most cPanel hosts provide MySQL instead of PostgreSQL
- We'll need to modify the database connection

## Step 3: Environment Configuration

Create `.env.production` file with:

```env
# Production Environment Variables
NODE_ENV=production

# Database Configuration
DATABASE_URL="postgresql://global_ads_user:YOUR_PASSWORD@localhost:5432/global_ads_db"
# Alternative MySQL URL if PostgreSQL not available:
# DATABASE_URL="mysql://global_ads_user:YOUR_PASSWORD@localhost:3306/global_ads_db"

# Redis Configuration
REDIS_URL="redis://localhost:6379"

# JWT Configuration
JWT_SECRET="your-super-secure-jwt-secret-key-here-change-this"
JWT_REFRESH_SECRET="your-super-secure-refresh-secret-key-here-change-this"

# API Configuration
PORT=5000
API_URL="https://yourdomain.com/api"

# Frontend Configuration
NEXT_PUBLIC_API_URL="https://yourdomain.com/api"

# Email Configuration (if using email features)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""

# File Upload Configuration
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE="10485760" # 10MB
```

## Step 4: Upload Files to cPanel

### 4.1. Upload Backend Files:
1. Go to **File Manager** in cPanel
2. Navigate to `public_html` (or your domain's root directory)
3. Create folder: `api` (for backend)
4. Upload these files/folders to `api/`:
   - `backend/dist/` (compiled JavaScript)
   - `backend/node_modules/` (dependencies)
   - `backend/package.json`
   - `backend/prisma/` (database schema)
   - `.env.production` (rename to `.env`)

### 4.2. Upload Frontend Files:
1. Upload contents of `frontend/out/` to `public_html/`
2. This includes all static HTML, CSS, JS files

## Step 5: Configure Web Server

### 5.1. For Node.js Backend:
1. Go to **"Node.js Selector"** in cPanel
2. Create new Node.js app:
   - **App Root**: `/public_html/api`
   - **App URL**: `/api`
   - **App Startup File**: `dist/server.js`
   - **Node.js Version**: 18.x or 20.x
3. Install dependencies: `npm install`
4. Start the application

### 5.2. Alternative - Use .htaccess for API routing:
Create `.htaccess` in `public_html/api/`:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ dist/server.js [QSA,L]
```

## Step 6: Database Migration

### 6.1. Run Prisma Migration:
1. SSH into your cPanel account (if available)
2. Navigate to `/public_html/api/`
3. Run: `npx prisma migrate deploy`
4. Run: `npx prisma generate`

### 6.2. Alternative - Manual Database Setup:
If SSH not available, manually create tables using cPanel's phpMyAdmin or database management tool.

## Step 7: Test Live Deployment

### 7.1. Test Frontend:
- Visit: `https://yourdomain.com`
- Should show landing page

### 7.2. Test Backend API:
- Visit: `https://yourdomain.com/api/health`
- Should return: `{"status":"OK"}`

### 7.3. Test Full Flow:
1. Sign up for new account
2. Create a feed
3. Test feed crawling
4. Create ads and campaigns

## Step 8: Domain Configuration

### 8.1. Update Domain Settings:
1. In cPanel, go to **"Subdomains"** or **"Addon Domains"**
2. Point your domain to the correct directory
3. Update DNS settings if needed

### 8.2. SSL Certificate:
1. Enable **"Let's Encrypt"** SSL in cPanel
2. Force HTTPS redirect

## Troubleshooting

### Common Issues:
1. **Database Connection Error**: Check DATABASE_URL format
2. **API Not Working**: Verify Node.js app is running
3. **Frontend Not Loading**: Check file permissions (755 for folders, 644 for files)
4. **CORS Errors**: Update API_URL in environment variables

### File Permissions:
```bash
# Set correct permissions
find /public_html -type d -exec chmod 755 {} \;
find /public_html -type f -exec chmod 644 {} \;
```

## Security Checklist

- [ ] Change default JWT secrets
- [ ] Use strong database passwords
- [ ] Enable SSL/HTTPS
- [ ] Set up regular backups
- [ ] Monitor error logs
- [ ] Update dependencies regularly

## Next Steps After Deployment

1. Test all functionality
2. Set up monitoring
3. Configure backups
4. Update DNS if needed
5. Test with real users
