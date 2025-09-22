#!/bin/bash

# Setup script for React frontend environment variables
# This script creates the necessary .env.local file for localhost development

echo "Setting up environment variables for React frontend..."

# Create .env.local file
cat > .env.local << 'EOF'
# React Frontend Environment Variables
# For localhost development

# API Configuration
VITE_API_URL=https://rankandrun.com/api

# Development Settings
NODE_ENV=development

# Dummy JWT Tokens for Development
# These are dummy tokens for localhost testing - replace with real tokens in production
VITE_DUMMY_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
VITE_DUMMY_REFRESH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

# App Configuration
VITE_APP_NAME=Global Ads Launch
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Production-ready SaaS for managing and optimizing global advertising campaigns

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_NOTIFICATIONS=true

# Development Tools
VITE_ENABLE_DEBUG_MODE=true
VITE_ENABLE_MOCK_DATA=true
EOF

echo "✅ Created .env.local file"
echo "✅ Environment variables configured for localhost development"
echo ""
echo "Your React frontend is now configured to:"
echo "  - Use production backend at https://rankandrun.com/api"
echo "  - Use dummy JWT tokens for authentication (no real backend needed)"
echo "  - Work in development mode with mock data"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "The frontend will be available at: http://localhost:3002"

