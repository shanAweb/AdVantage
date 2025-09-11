# ✅ cPanel Deployment Checklist

## Pre-Deployment (Completed ✅)
- [x] Production build successful
- [x] Frontend built to `/out` folder
- [x] Backend compiled to `/dist` folder
- [x] All TypeScript errors fixed
- [x] Package.json configured for production

## Step 1: Database Setup
- [ ] Login to cPanel
- [ ] Create PostgreSQL database: `global_ads_db`
- [ ] Create database user: `global_ads_user`
- [ ] Assign user to database with ALL PRIVILEGES
- [ ] Note down database credentials
- [ ] Alternative: Use MySQL if PostgreSQL unavailable

## Step 2: Environment Configuration
- [ ] Create `.env.production` file
- [ ] Set DATABASE_URL with correct credentials
- [ ] Set JWT_SECRET and JWT_REFRESH_SECRET (strong passwords)
- [ ] Set API_URL to your domain
- [ ] Set NEXT_PUBLIC_API_URL to your domain
- [ ] Configure Redis URL (if available)

## Step 3: File Upload
- [ ] Upload backend files to `/public_html/api/`
  - [ ] `backend/dist/` folder
  - [ ] `backend/node_modules/` folder
  - [ ] `backend/package.json`
  - [ ] `backend/prisma/` folder
  - [ ] `.env.production` (rename to `.env`)
- [ ] Upload frontend files to `/public_html/`
  - [ ] All contents from `frontend/out/` folder

## Step 4: Web Server Configuration
- [ ] Set up Node.js app in cPanel
  - [ ] App Root: `/public_html/api`
  - [ ] App URL: `/api`
  - [ ] Startup File: `dist/server.js`
  - [ ] Node.js Version: 18.x or 20.x
- [ ] Install dependencies: `npm install`
- [ ] Start the application

## Step 5: Database Migration
- [ ] Run Prisma migration: `npx prisma migrate deploy`
- [ ] Generate Prisma client: `npx prisma generate`
- [ ] Alternative: Manual table creation if SSH unavailable

## Step 6: Testing
- [ ] Test frontend: Visit `https://yourdomain.com`
- [ ] Test backend: Visit `https://yourdomain.com/api/health`
- [ ] Test signup flow
- [ ] Test feed creation
- [ ] Test feed crawling
- [ ] Test ad creation
- [ ] Test campaign creation

## Step 7: Domain & SSL
- [ ] Configure domain settings in cPanel
- [ ] Enable SSL certificate (Let's Encrypt)
- [ ] Force HTTPS redirect
- [ ] Update DNS if needed

## Step 8: Security & Monitoring
- [ ] Change default JWT secrets
- [ ] Set up regular backups
- [ ] Monitor error logs
- [ ] Test all functionality with real users

## Quick Commands for cPanel

### If SSH Access Available:
```bash
# Navigate to API directory
cd /public_html/api/

# Install dependencies
npm install --production

# Run database migration
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Start application
npm start
```

### File Permissions:
```bash
# Set correct permissions
find /public_html -type d -exec chmod 755 {} \;
find /public_html -type f -exec chmod 644 {} \;
```

## Troubleshooting

### Common Issues:
1. **Database Connection Error**: Check DATABASE_URL format
2. **API Not Working**: Verify Node.js app is running
3. **Frontend Not Loading**: Check file permissions
4. **CORS Errors**: Update API_URL in environment variables

### Environment Variables Template:
```env
NODE_ENV=production
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secure-jwt-secret-key"
JWT_REFRESH_SECRET="your-super-secure-refresh-secret-key"
PORT=5000
API_URL="https://yourdomain.com/api"
NEXT_PUBLIC_API_URL="https://yourdomain.com/api"
```

## Success Criteria
- [ ] Website loads at your domain
- [ ] API responds at `/api/health`
- [ ] User can sign up and login
- [ ] Feed creation works
- [ ] Feed crawling works
- [ ] Ad creation works
- [ ] Campaign creation works
- [ ] All features functional in production

