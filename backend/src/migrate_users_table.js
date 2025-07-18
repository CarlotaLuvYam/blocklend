// Run this script once to create the users table in MySQL
const { getPool } = require('./db');

async function migrate() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      firstName VARCHAR(50) NOT NULL,
      lastName VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255),
      walletAddress VARCHAR(100) UNIQUE
    );
  `;
  try {
    await getPool.query(createTableSQL);
    console.log('Users table created or already exists.');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

migrate();
