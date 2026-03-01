# AdVantage

A production-ready SaaS application for managing and optimizing global advertising campaigns across Google Ads, Microsoft Ads, and YouTube Ads platforms.

## 🚀 Features

- **Multi-Platform Support**: Google Ads, Microsoft Ads, YouTube Ads
- **Campaign Management**: Create, launch, pause, and optimize campaigns
- **Advanced Analytics**: Real-time reporting with ROAS tracking
- **Auto Optimization**: Intelligent rules for campaign optimization
- **B2B Audience Wizard**: Custom audience targeting
- **Stripe Integration**: Subscription billing and feature gating
- **Enterprise Security**: OAuth integration and role-based access
- **cPanel Ready**: Optimized for shared hosting deployment

## 🏗️ Architecture

### Frontend
- **Next.js 14** with App Router
- **TailwindCSS** for styling
- **shadcn/ui** component library
- **Static Export** ready for cPanel hosting
- **TypeScript** for type safety

### Backend
- **Express.js** with TypeScript
- **Prisma ORM** with PostgreSQL
- **Redis** for caching and job queues
- **JWT** authentication
- **Modular architecture** for scalability

### Database
- **PostgreSQL** for primary data storage
- **Redis** for caching and background jobs
- **Prisma** for type-safe database operations

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 13+
- Redis 6+
- Docker & Docker Compose (optional)

## 🛠️ Local Development Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd global-ads-launch-optimization

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp env.example .env

# Edit .env with your configuration
nano .env
```

**Required Environment Variables:**
```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/global_ads_db
REDIS_URL=redis://localhost:6379

# JWT Secrets (generate secure keys for production)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here

# API URLs
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000/api
```

### 3. Database Setup

```bash
# Start PostgreSQL and Redis (using Docker)
docker-compose up -d postgres redis

# Or start them manually
# PostgreSQL: Start your PostgreSQL service
# Redis: Start your Redis service

# Run database migrations
cd backend
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Seed database (optional)
npm run db:seed
```

### 4. Start Development Servers

```bash
# Start both frontend and backend (from root directory)
npm run dev

# Or start them separately:

# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Documentation**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## 🐳 Docker Development

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build -d
```

### Available Services

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **pgAdmin**: http://localhost:5050 (development profile)
- **Redis Commander**: http://localhost:8081 (development profile)

## 🚀 Production Deployment (cPanel)

### Prerequisites for cPanel Deployment

1. **cPanel hosting** with Node.js support
2. **PostgreSQL database** (shared or dedicated)
3. **Redis** (if available, or use alternative caching)
4. **SSL certificate** for HTTPS

### Frontend Deployment

1. **Build the frontend for static export:**
```bash
cd frontend
npm run build
npm run export
```

2. **Upload to cPanel:**
   - Upload the `out/` folder contents to your domain's `public_html/` directory
   - Ensure `index.html` is in the root of `public_html/`

3. **Configure .htaccess** (if needed):
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Backend Deployment

1. **Build the backend:**
```bash
cd backend
npm run build
```

2. **Create backend directory structure in cPanel:**
```
public_html/
├── api/                    # Backend API
│   ├── dist/              # Compiled JavaScript
│   ├── node_modules/      # Dependencies
│   ├── package.json       # Backend package.json
│   └── server.js          # Entry point
└── index.html             # Frontend
```

3. **Upload backend files:**
   - Upload `dist/` folder contents to `public_html/api/dist/`
   - Upload `package.json` to `public_html/api/`
   - Create `server.js` in `public_html/api/`:

```javascript
// public_html/api/server.js
require('dotenv').config();
const app = require('./dist/server.js');
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

4. **Install backend dependencies:**
```bash
cd public_html/api
npm install --production
```

5. **Configure environment variables:**
   - Create `.env` file in `public_html/api/`
   - Set production database and API URLs

6. **Set up Node.js application in cPanel:**
   - Go to "Node.js" in cPanel
   - Create new application
   - Set application root to `public_html/api`
   - Set application URL to `https://yourdomain.com/api`
   - Set startup file to `server.js`
   - Start the application

### Database Setup

1. **Create PostgreSQL database** in cPanel
2. **Run migrations:**
```bash
cd public_html/api
npx prisma migrate deploy
npx prisma generate
```

### SSL Configuration

1. **Enable SSL** for your domain
2. **Update CORS settings** in backend to include your production domain
3. **Update environment variables** with production URLs

## 🔧 Available Scripts

### Root Level
```bash
npm run dev          # Start both frontend and backend
npm run build        # Build both frontend and backend
npm run start        # Start both in production mode
npm run docker:up    # Start all services with Docker
npm run docker:down  # Stop all Docker services
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run export       # Export static files for cPanel
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Backend
```bash
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run db:migrate   # Run database migrations
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed database with sample data
npm run db:reset     # Reset database (WARNING: deletes all data)
npm run db:studio    # Open Prisma Studio
npm run test         # Run tests
npm run lint         # Run ESLint
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users/stats` - Get user statistics
- `PUT /api/users/subscription` - Update subscription
- `DELETE /api/users/account` - Delete account

### Campaigns
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get campaign by ID
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign
- `POST /api/campaigns/:id/launch` - Launch campaign
- `POST /api/campaigns/:id/pause` - Pause campaign
- `POST /api/campaigns/:id/resume` - Resume campaign
- `GET /api/campaigns/:id/performance` - Get campaign performance

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard stats
- `GET /api/analytics/campaigns` - Get campaign analytics
- `GET /api/analytics/platforms` - Get platform analytics
- `GET /api/analytics/conversions` - Get conversion analytics
- `GET /api/analytics/keywords` - Get keyword performance
- `GET /api/analytics/audience` - Get audience insights
- `GET /api/analytics/export` - Export analytics data

### Webhooks
- `POST /api/webhooks/stripe` - Stripe webhooks
- `POST /api/webhooks/google-ads` - Google Ads webhooks
- `POST /api/webhooks/microsoft-ads` - Microsoft Ads webhooks
- `POST /api/webhooks/youtube` - YouTube webhooks

## 🔐 Security Features

- **JWT Authentication** with refresh tokens
- **Password hashing** with bcrypt
- **Rate limiting** on API endpoints
- **CORS protection** with configurable origins
- **Helmet.js** for security headers
- **Input validation** with express-validator
- **SQL injection protection** with Prisma ORM
- **XSS protection** with proper sanitization

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- campaigns.test.ts
```

## 📝 Environment Variables

See `env.example` for complete list of environment variables.

### Required for Basic Functionality
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_REFRESH_SECRET` - JWT refresh token secret

### Required for External Integrations
- `STRIPE_SECRET_KEY` - Stripe API secret key
- `GOOGLE_ADS_CLIENT_ID` - Google Ads API client ID
- `GOOGLE_ADS_CLIENT_SECRET` - Google Ads API client secret
- `MICROSOFT_ADS_CLIENT_ID` - Microsoft Ads API client ID
- `MICROSOFT_ADS_CLIENT_SECRET` - Microsoft Ads API client secret

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify DATABASE_URL is correct
   - Ensure database exists

2. **Redis Connection Error**
   - Check Redis is running
   - Verify REDIS_URL is correct

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version (18+)
   - Verify TypeScript configuration

4. **cPanel Deployment Issues**
   - Check Node.js version in cPanel
   - Verify file permissions
   - Check application logs in cPanel

### Logs

- **Backend logs**: Check `logs/` directory
- **Docker logs**: `docker-compose logs -f [service-name]`
- **cPanel logs**: Check application logs in cPanel Node.js section

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting section

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] Basic authentication and user management
- [x] Campaign CRUD operations
- [x] Basic analytics dashboard
- [x] Stripe integration setup

### Phase 2 (Next)
- [ ] Google Ads API integration
- [ ] Microsoft Ads API integration
- [ ] Real-time campaign performance tracking
- [ ] Advanced analytics and reporting

### Phase 3 (Future)
- [ ] YouTube Ads integration
- [ ] Auto-optimization rules engine
- [ ] B2B audience wizard
- [ ] Advanced alerting system

---

**Built with ❤️ for global advertising success**







