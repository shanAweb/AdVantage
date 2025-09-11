#!/bin/bash

# Frontend Environment Setup Script
echo "🚀 Setting up frontend environment..."

cat > .env.local << 'EOF'
# Frontend Environment Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Global Ads Launch
NEXT_PUBLIC_APP_VERSION=1.0.0
EOF

echo "✅ Frontend environment file created!"
echo "📝 Next steps:"
echo "1. Run: npm install"
echo "2. Run: npm run dev"
echo "3. Access: http://localhost:3000"




