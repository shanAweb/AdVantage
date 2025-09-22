// Production server entry point
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://rankandrun.com',
  credentials: true
}));

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Root path handler
app.get('/', (req, res) => {
  res.json({
    message: 'Global Ads Launch API Server',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      api: '/api',
      debug: '/debug',
      auth: '/api/auth'
    }
  });
});

// API ping
app.get('/api/ping', (req, res) => {
  res.status(200).json({
    message: 'Global Ads Launch API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.get('/api', (req, res) => {
  console.log('API route hit:', req.url);
  res.json({
    name: 'Global Ads Launch API',
    version: '1.0.0',
    description: 'Production-ready SaaS API for global advertising campaign management',
    endpoints: {
      health: '/health',
      ping: '/api/ping',
      auth: '/api/auth',
      users: '/api/users',
      campaigns: '/api/campaigns',
      analytics: '/api/analytics',
      webhooks: '/api/webhooks',
      feeds: '/api/feeds',
      ads: '/api/ads',
      newCampaigns: '/api/new-campaigns',
      crawler: '/api/crawler'
    }
  });
});

// Debug route
app.get('/debug', (req, res) => {
  console.log('Debug route hit:', req.url);
  res.json({
    message: 'Debug route working',
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// ===========================================
// AUTH ROUTES
// ===========================================
app.post('/api/auth/register', (req, res) => {
  console.log('Register route hit:', req.url, req.body);
  try {
    const { email, password, firstName, lastName, company } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields' }
      });
    }

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: 'user_' + Date.now(),
          email,
          firstName,
          lastName,
          company: company || ''
        },
        tokens: {
          accessToken: 'mock_access_token_' + Date.now(),
          refreshToken: 'mock_refresh_token_' + Date.now()
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

app.post('/api/auth/login', (req, res) => {
  console.log('Login route hit:', req.url, req.body);
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email and password are required' }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: 'user_' + Date.now(),
          email,
          firstName: 'Test',
          lastName: 'User'
        },
        tokens: {
          accessToken: 'mock_access_token_' + Date.now(),
          refreshToken: 'mock_refresh_token_' + Date.now()
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// ===========================================
// FEED ROUTES
// ===========================================
app.post('/api/feeds', (req, res) => {
  console.log('Create feed route hit:', req.url, req.body);
  try {
    const { name, siteUrl, country, currency } = req.body;
    
    if (!name || !siteUrl) {
      return res.status(400).json({
        success: false,
        error: { message: 'Name and site URL are required' }
      });
    }

    res.status(201).json({
      success: true,
      data: {
        feed: {
          id: 'feed_' + Date.now(),
          name,
          siteUrl,
          country: country || 'US',
          currency: currency || 'USD',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

app.get('/api/feeds', (req, res) => {
  console.log('Get feeds route hit:', req.url);
  try {
    res.status(200).json({
      success: true,
      data: {
        feeds: [
          {
            id: 'feed_1',
            name: 'Sample Feed',
            siteUrl: 'https://example.com',
            country: 'US',
            currency: 'USD',
            status: 'active',
            createdAt: new Date().toISOString()
          }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

app.get('/api/feeds/:id', (req, res) => {
  console.log('Get feed by ID route hit:', req.url);
  try {
    const { id } = req.params;
    res.status(200).json({
      success: true,
      data: {
        feed: {
          id,
          name: 'Sample Feed',
          siteUrl: 'https://example.com',
          country: 'US',
          currency: 'USD',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

app.put('/api/feeds/:id', (req, res) => {
  console.log('Update feed route hit:', req.url, req.body);
  try {
    const { id } = req.params;
    res.status(200).json({
      success: true,
      data: {
        feed: {
          id,
          ...req.body,
          updatedAt: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

app.delete('/api/feeds/:id', (req, res) => {
  console.log('Delete feed route hit:', req.url);
  try {
    res.status(200).json({
      success: true,
      message: 'Feed deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// ===========================================
// CAMPAIGN ROUTES
// ===========================================
app.post('/api/campaigns', (req, res) => {
  console.log('Create campaign route hit:', req.url, req.body);
  try {
    const { name, platform, budget } = req.body;
    
    if (!name || !platform || !budget) {
      return res.status(400).json({
        success: false,
        error: { message: 'Name, platform, and budget are required' }
      });
    }

    res.status(201).json({
      success: true,
      data: {
        campaign: {
          id: 'campaign_' + Date.now(),
          name,
          platform,
          budget,
          status: 'draft',
          createdAt: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

app.get('/api/campaigns', (req, res) => {
  console.log('Get campaigns route hit:', req.url);
  try {
    res.status(200).json({
      success: true,
      data: {
        campaigns: [
          {
            id: 'campaign_1',
            name: 'Sample Campaign',
            platform: 'google',
            budget: 1000,
            status: 'active',
            createdAt: new Date().toISOString()
          }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// ===========================================
// ANALYTICS ROUTES
// ===========================================
app.get('/api/analytics/dashboard', (req, res) => {
  console.log('Dashboard analytics route hit:', req.url);
  try {
    res.status(200).json({
      success: true,
      data: {
        totalCampaigns: 5,
        totalSpend: 2500,
        totalClicks: 15000,
        totalConversions: 250,
        roas: 3.2
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// ===========================================
// PRODUCT ROUTES
// ===========================================
app.get('/api/products', (req, res) => {
  console.log('Get products route hit:', req.url);
  try {
    res.status(200).json({
      success: true,
      data: {
        products: [
          {
            id: 'product_1',
            title: 'Sample Product',
            price: 29.99,
            currency: 'USD',
            imageUrl: 'https://via.placeholder.com/300',
            link: 'https://example.com/product/1'
          }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// ===========================================
// AD ROUTES
// ===========================================
app.post('/api/ads', (req, res) => {
  console.log('Create ad route hit:', req.url, req.body);
  try {
    const { feedId, productId, headline, description } = req.body;
    
    res.status(201).json({
      success: true,
      data: {
        ad: {
          id: 'ad_' + Date.now(),
          feedId,
          productId,
          headline: headline || 'Sample Headline',
          description: description || 'Sample Description',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

app.get('/api/ads', (req, res) => {
  console.log('Get ads route hit:', req.url);
  try {
    res.status(200).json({
      success: true,
      data: {
        ads: [
          {
            id: 'ad_1',
            headline: 'Sample Ad Headline',
            description: 'Sample ad description',
            status: 'active',
            createdAt: new Date().toISOString()
          }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// ===========================================
// USER ROUTES
// ===========================================
app.get('/api/users/profile', (req, res) => {
  console.log('Get user profile route hit:', req.url);
  try {
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: 'user_1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          company: 'Test Company'
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Debug all routes
app.use('*', (req, res, next) => {
  console.log('Route hit:', req.method, req.url, req.originalUrl);
  next();
});

// 404 handler
app.use('*', (req, res) => {
  console.log('404 - Route not found:', req.method, req.url);
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      url: req.url,
      method: req.method
    }
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error'
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🔗 API docs: http://localhost:${port}/api`);
});

module.exports = app;