const express = require('express');
const cors = require('cors');
const { default: feedRoutes } = require('./routes/feeds');

const app = express();
const port = 5000;

// Disable CORS restrictions completely
app.use(cors({ origin: '*' }));

// Parse JSON bodies
app.use(express.json());

// Use feed routes
app.use('/api/feeds', feedRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
  console.log(`Temp server running on port ${port}`);
});


