const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

// Disable CORS restrictions completely
app.use(cors({ origin: '*' }));

// Parse JSON bodies
app.use(express.json());

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Test server is running!',
    timestamp: new Date().toISOString(),
    port: port
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Start server
app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`Test endpoint: http://localhost:${port}/test`);
});


