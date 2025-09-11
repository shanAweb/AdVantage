# 🚀 Quick Start Guide - Global Ads Launch SaaS

## ⚡ Get Started in 5 Minutes

### 1. Setup Environment
```bash
# Run the setup script to create .env with dummy values
./setup-env.sh
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 3. Start Database Services
```bash
# Option A: Using Docker (Recommended)
docker-compose up -d postgres redis

# Option B: Manual setup
# Start PostgreSQL and Redis on your system
```

### 4. Setup Database
```bash
# Run database migrations
cd backend
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Seed with sample data (optional)
npm run db:seed
```

### 5. Start the Application
```bash
# From root directory - starts both frontend and backend
npm run dev

# Or start them separately:
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev
```

## 🌐 Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health
- **API Documentation**: http://localhost:5000/api

## 🧪 Test the Application

### 1. Test Backend API
```bash
# Health check
curl http://localhost:5000/health

# API ping
curl http://localhost:5000/api/ping

# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "company": "Test Company"
  }'
```

### 2. Test Frontend
1. Open http://localhost:3000
2. You should see the landing page
3. Try the "Get Started" button
4. Test the responsive design

## 🔧 Available Commands

```bash
# Development
npm run dev              # Start both frontend and backend
docker-compose up -d     # Start all services with Docker

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed with sample data
npm run db:reset         # Reset database (WARNING: deletes all data)

# Production
npm run build           # Build both frontend and backend
npm run export          # Export frontend for cPanel deployment
```

## 🐳 Docker Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build -d
```

## 📊 Sample Data

The seed script creates:
- 2 sample users (admin@globaladslaunch.com, demo@globaladslaunch.com)
- 3 sample campaigns across different platforms
- 30 days of performance data
- Sample integrations and notifications

**Default Login Credentials:**
- Email: `admin@globaladslaunch.com`
- Password: `password123`

## 🚨 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres
```

### Redis Connection Issues
```bash
# Check if Redis is running
docker-compose ps redis

# Check logs
docker-compose logs redis
```

### Port Already in Use
```bash
# Kill processes on ports 3000 and 5000
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules frontend/node_modules backend/node_modules
npm install
cd frontend && npm install
cd ../backend && npm install
```

## 🔄 Next Steps

1. **Test the basic functionality** - Register, login, create campaigns
2. **Explore the API** - Use the health check and ping endpoints
3. **Check the database** - Use Prisma Studio: `npm run db:studio`
4. **Customize the frontend** - Modify the landing page and components
5. **Add real credentials** - Replace dummy values in `.env` when ready

## 📚 Documentation

- **Full README**: See `README.md` for comprehensive documentation
- **API Endpoints**: Check the backend routes for available endpoints
- **Database Schema**: See `backend/prisma/schema.prisma`
- **Frontend Components**: Explore `frontend/src/components/`

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Review the logs: `docker-compose logs -f`
3. Check the README.md for detailed setup instructions
4. Ensure all prerequisites are installed (Node.js 18+, Docker)

---

**Happy coding! 🎉**




