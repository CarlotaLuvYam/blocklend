const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global pool variable
let pool;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'BlockLend Backend is running',
    timestamp: new Date().toISOString()
  });
});

// MySQL2 Database connection
const connectDB = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '030621Ljh',
      database: process.env.MYSQL_DATABASE || 'blocklend',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  
    // Test the connection
    const connection = await pool.getConnection();
    console.log('MySQL2 connected successfully');
    connection.release();
  } catch (error) {
    console.error('MySQL2 connection error:', error);
    process.exit(1);
  }
};

// Function to get the pool instance
const getPool = () => {
  if (!pool) {
    throw new Error('Database pool not initialized');
  }
  return pool;
};

// Start server
const startServer = async () => {
  await connectDB();
  console.log("------");
  console.log("Pool initialized:", !!pool);
  console.log("------");
  
  // Import routes AFTER database connection is established
  const authRoutes = require('./routes/auth');
  const userRoutes = require('./routes/users');
  const loanRoutes = require('./routes/loans');
  const adminRoutes = require('./routes/admin');
  const analyticsRoutes = require('./routes/analytics');
  
  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api', loanRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/analytics', analyticsRoutes);
  
  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });
  
  // Global error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || 'Something went wrong!',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
};

startServer();

// Export pool getter function for use in models
module.exports = { app, getPool };