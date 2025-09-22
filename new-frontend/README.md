# Global Ads Launch - React Frontend

A complete React frontend for the Global Ads Launch & Optimization SaaS platform, built with Vite, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment variables:**
   ```bash
   ./setup-env.sh
   ```
   This creates a `.env.local` file with localhost configuration and dummy JWT tokens.

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Frontend: http://localhost:3002
   - Backend: https://rankandrun.com/api (production)

## 🔧 Configuration

### Environment Variables

The `.env.local` file contains:

```env
# API Configuration
VITE_API_URL=https://rankandrun.com/api

# Development Settings
NODE_ENV=development

# Dummy JWT Tokens (for localhost testing)
VITE_DUMMY_ACCESS_TOKEN=dummy-token
VITE_DUMMY_REFRESH_TOKEN=dummy-refresh-token
```

### Localhost Development Mode

When running on localhost, the app automatically uses:
- **Dummy authentication** - No real backend needed for login/signup
- **Mock data** - All API calls return dummy data
- **Simulated delays** - Realistic loading states

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Card, etc.)
│   ├── Layout.tsx      # Main layout with navigation
│   └── ProtectedRoute.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── pages/              # Page components
│   ├── HomePage.tsx    # Landing page
│   ├── SignInPage.tsx  # Login page
│   ├── SignUpPage.tsx  # Registration page
│   ├── DashboardPage.tsx # Main dashboard
│   └── CampaignsPage.tsx # Campaign management
├── lib/                # Utilities and API client
│   ├── apiClient.ts    # API client with all endpoints
│   └── utils.ts        # Utility functions
└── App.tsx             # Main app component with routing
```

## 🎯 Features

### ✅ Authentication
- Login/Signup with form validation
- Forgot password functionality
- Protected routes
- Dummy JWT tokens for localhost testing

### ✅ Dashboard
- Interactive overview with stats
- Campaign management
- Real-time data visualization
- Responsive design

### ✅ Campaign Management
- Create, edit, delete campaigns
- Campaign analytics and insights
- Multi-platform support (Google Ads, Microsoft Ads, YouTube)
- Advanced filtering and search

### ✅ UI Components
- Modern, responsive design with Tailwind CSS
- Dark/light mode support
- Toast notifications
- Form validation
- Loading states

## 🔌 Backend Integration

The frontend is designed to work with the existing Express.js backend:

- **API Endpoints:** All endpoints match the backend structure
- **Authentication:** JWT-based auth with refresh tokens
- **Error Handling:** Comprehensive error handling and user feedback
- **TypeScript:** Full type safety for API responses

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Docker Support
The project includes Docker configuration for containerized deployment.

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Hot Reload
The development server supports hot module replacement (HMR) for instant updates.

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔒 Security

- JWT token management
- Protected routes
- Input validation
- XSS protection
- CSRF protection

## 📄 License

This project is part of the Global Ads Launch & Optimization SaaS platform.

---

**Note:** This React frontend is a complete migration from the original Next.js frontend, maintaining all functionality while using modern React patterns and Vite for optimal development experience.

