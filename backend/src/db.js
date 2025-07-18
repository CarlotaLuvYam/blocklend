// config/database.js
const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

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
    
    return pool;
  } catch (error) {
    console.error('MySQL2 connection error:', error);
    throw error;
  }
};

connectDB();

const getPool = () => {
  if (!pool) {
    throw new Error('Database pool not initialized. Call connectDB() first.');
  }
  return pool;
};

module.exports = { connectDB, getPool };