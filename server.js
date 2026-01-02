// ======================================================
// University Management System - Main Server File
// ======================================================
// This file sets up the Express server and configures
// all routes and middleware for the application
// ======================================================

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import route files
const authRoutes = require('./routes/authRoutes');
const routineRoutes = require('./routes/routineRoutes');
const researchPaperRoutes = require('./routes/researchPaperRoutes');
const hostelRoutes = require('./routes/hostelRoutes');
const departmentRoutes = require('./routes/departmentRoutes');

// Initialize Express app
const app = express();

// Define port (use environment variable or default to 3000)
const PORT = process.env.PORT || 3000;

// ======================================================
// Middleware Configuration
// ======================================================

// Enable CORS for cross-origin requests
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json());

// Parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Log incoming requests (simple logging middleware)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ======================================================
// Routes Configuration
// ======================================================

// Root endpoint - API information
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to University Management System API',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      routines: '/api/routines',
      researchPapers: '/api/research-papers',
      hostel: '/api/hostel'
    },
    documentation: 'See README.md for complete API documentation'
  });
});

// Mount route handlers
app.use('/api/auth', authRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/research-papers', researchPaperRoutes);
app.use('/api/hostel', hostelRoutes);
app.use('/api', departmentRoutes);

// ======================================================
// Error Handling
// ======================================================

// Handle 404 - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ======================================================
// Start Server
// ======================================================

app.listen(PORT, () => {
  console.log('======================================================');
  console.log('  University Management System API Server');
  console.log('======================================================');
  console.log(`Server is running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('======================================================');
  console.log('Available endpoints:');
  console.log(`  - GET    http://localhost:${PORT}/`);
  console.log(`  - POST   http://localhost:${PORT}/api/routines`);
  console.log(`  - GET    http://localhost:${PORT}/api/routines`);
  console.log(`  - POST   http://localhost:${PORT}/api/research-papers`);
  console.log(`  - GET    http://localhost:${PORT}/api/research-papers`);
  console.log(`  - PATCH  http://localhost:${PORT}/api/research-papers/:id/status`);
  console.log(`  - POST   http://localhost:${PORT}/api/hostel`);
  console.log(`  - GET    http://localhost:${PORT}/api/hostel`);
  console.log('======================================================');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('⚠️  Unhandled Promise Rejection:', err.message);
  // Don't exit - let the server continue running
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('⚠️  Uncaught Exception:', err.message);
  // Don't exit on database connection errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR') {
    console.log('   Continuing with Mock Database...');
  }
});

module.exports = app;
