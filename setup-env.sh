#!/bin/bash

# ===========================================
# GLOBAL ADS LAUNCH - ENVIRONMENT SETUP SCRIPT
# ===========================================
# This script creates a .env file with dummy values for testing

echo "🚀 Setting up environment file with dummy values for testing..."

# Create .env file with dummy values
cat > .env << 'EOF'
# ===========================================
# GLOBAL ADS LAUNCH & OPTIMIZATION - ENV CONFIG
# ===========================================
# This file contains dummy values for testing
# Replace with real values when ready for production

# ===========================================
# APPLICATION SETTINGS
# ===========================================
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000/api

# ===========================================
# DATABASE CONFIGURATION
# ===========================================
# PostgreSQL connection string (using dummy values for testing)
DATABASE_URL=postgresql://postgres:password@localhost:5432/global_ads_db

# ===========================================
# REDIS CONFIGURATION
# ===========================================
# Redis connection string (using dummy values for testing)
REDIS_URL=redis://localhost:6379

# ===========================================
# JWT CONFIGURATION
# ===========================================
# Dummy JWT secrets for development (CHANGE IN PRODUCTION!)
JWT_SECRET=dev-jwt-secret-key-change-in-production-12345
JWT_REFRESH_SECRET=dev-refresh-secret-key-change-in-production-67890

# JWT expiration times (in seconds)
JWT_EXPIRES_IN=900
JWT_REFRESH_EXPIRES_IN=604800

# ===========================================
# STRIPE CONFIGURATION
# ===========================================
# Dummy Stripe keys for testing (replace with real keys when ready)
STRIPE_SECRET_KEY=sk_test_dummy_stripe_secret_key_for_testing_12345
STRIPE_PUBLISHABLE_KEY=pk_test_dummy_stripe_publishable_key_for_testing_67890
STRIPE_WEBHOOK_SECRET=whsec_dummy_webhook_secret_for_testing_12345

# Stripe price IDs for different plans (dummy values)
STRIPE_STARTER_PRICE_ID=price_dummy_starter_plan_id
STRIPE_PROFESSIONAL_PRICE_ID=price_dummy_professional_plan_id
STRIPE_ENTERPRISE_PRICE_ID=price_dummy_enterprise_plan_id

# ===========================================
# GOOGLE ADS API CONFIGURATION
# ===========================================
# Dummy Google Ads API credentials (replace with real credentials when ready)
GOOGLE_ADS_CLIENT_ID=dummy_google_ads_client_id_12345
GOOGLE_ADS_CLIENT_SECRET=dummy_google_ads_client_secret_67890
GOOGLE_ADS_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
GOOGLE_ADS_DEVELOPER_TOKEN=dummy_google_ads_developer_token_12345
GOOGLE_ADS_CUSTOMER_ID=dummy_google_ads_customer_id_67890

# ===========================================
# GOOGLE MERCHANT CENTER API
# ===========================================
GOOGLE_MERCHANT_CENTER_CLIENT_ID=dummy_merchant_center_client_id_12345
GOOGLE_MERCHANT_CENTER_CLIENT_SECRET=dummy_merchant_center_client_secret_67890
GOOGLE_MERCHANT_CENTER_REDIRECT_URI=http://localhost:5000/api/auth/merchant/callback

# ===========================================
# MICROSOFT ADS API CONFIGURATION
# ===========================================
# Dummy Microsoft Ads API credentials (replace with real credentials when ready)
MICROSOFT_ADS_CLIENT_ID=dummy_microsoft_ads_client_id_12345
MICROSOFT_ADS_CLIENT_SECRET=dummy_microsoft_ads_client_secret_67890
MICROSOFT_ADS_REDIRECT_URI=http://localhost:5000/api/auth/microsoft/callback
MICROSOFT_ADS_CUSTOMER_ID=dummy_microsoft_ads_customer_id_67890

# ===========================================
# YOUTUBE API CONFIGURATION
# ===========================================
YOUTUBE_CLIENT_ID=dummy_youtube_client_id_12345
YOUTUBE_CLIENT_SECRET=dummy_youtube_client_secret_67890
YOUTUBE_REDIRECT_URI=http://localhost:5000/api/auth/youtube/callback

# ===========================================
# GOOGLE ANALYTICS 4 (GA4) CONFIGURATION
# ===========================================
GA4_CLIENT_ID=dummy_ga4_client_id_12345
GA4_CLIENT_SECRET=dummy_ga4_client_secret_67890
GA4_REDIRECT_URI=http://localhost:5000/api/auth/ga4/callback
GA4_PROPERTY_ID=dummy_ga4_property_id_12345

# ===========================================
# GOOGLE SEARCH CONSOLE CONFIGURATION
# ===========================================
GSC_CLIENT_ID=dummy_gsc_client_id_12345
GSC_CLIENT_SECRET=dummy_gsc_client_secret_67890
GSC_REDIRECT_URI=http://localhost:5000/api/auth/gsc/callback

# ===========================================
# EMAIL CONFIGURATION
# ===========================================
# Dummy SMTP settings for testing (replace with real SMTP when ready)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=dummy_email@gmail.com
SMTP_PASS=dummy_app_password_12345

# Email templates
EMAIL_FROM_NAME=Global Ads Launch
EMAIL_FROM_ADDRESS=noreply@globaladslaunch.com

# ===========================================
# FILE UPLOAD CONFIGURATION
# ===========================================
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf,text/csv,application/vnd.ms-excel
UPLOAD_DIR=uploads

# ===========================================
# RATE LIMITING CONFIGURATION
# ===========================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ===========================================
# LOGGING CONFIGURATION
# ===========================================
LOG_LEVEL=info
LOG_DIR=logs

# ===========================================
# SECURITY CONFIGURATION
# ===========================================
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
SESSION_SECRET=dummy-session-secret-for-testing-12345
ENCRYPTION_KEY=dummy-32-character-encryption-key-12345

# ===========================================
# MONITORING & ANALYTICS
# ===========================================
SENTRY_DSN=dummy_sentry_dsn_for_testing_12345
GA_TRACKING_ID=dummy_ga_tracking_id_12345

# ===========================================
# CPANEL DEPLOYMENT SETTINGS
# ===========================================
CPANEL_DOMAIN=yourdomain.com
CPANEL_SUBDOMAIN=api.yourdomain.com
CPANEL_SSL_CERT_PATH=/path/to/ssl/certificate

# ===========================================
# DEVELOPMENT SETTINGS
# ===========================================
ENABLE_SWAGGER=true
ENABLE_DEBUG_ROUTES=true
MOCK_EXTERNAL_APIS=true

# ===========================================
# PRODUCTION SETTINGS
# ===========================================
ENABLE_COMPRESSION=true
ENABLE_CACHING=true
CACHE_TTL=3600

# ===========================================
# WEBHOOK CONFIGURATION
# ===========================================
WEBHOOK_BASE_URL=https://api.yourdomain.com/api/webhooks

# ===========================================
# BACKUP CONFIGURATION
# ===========================================
BACKUP_ENABLED=true
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30

# ===========================================
# FEATURE FLAGS
# ===========================================
FEATURE_GOOGLE_ADS=true
FEATURE_MICROSOFT_ADS=true
FEATURE_YOUTUBE_ADS=true
FEATURE_GA4_INTEGRATION=true
FEATURE_GSC_INTEGRATION=true
FEATURE_AUTO_OPTIMIZATION=true
FEATURE_B2B_WIZARD=true
FEATURE_ALERTS=true
EOF

echo "✅ Environment file created successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Make sure PostgreSQL and Redis are running"
echo "2. Run: npm install (in both frontend and backend directories)"
echo "3. Run: npm run db:migrate (in backend directory)"
echo "4. Run: npm run dev (from root directory)"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000/api"
echo "   Health:   http://localhost:5000/health"
echo ""
echo "⚠️  Remember to replace dummy values with real credentials when ready for production!"




