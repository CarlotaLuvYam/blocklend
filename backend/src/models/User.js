const bcrypt = require('bcryptjs');
const { pool } = require('../server');

// Utility: get pool
const getPool = () => pool();

// User CRUD and auth functions
const createUser = async (userData) => {
  const conn = await getPool().getConnection();
  try {
    const hash = await bcrypt.hash(userData.password, 12);
    const [result] = await conn.query(
      `INSERT INTO users (email, password, firstName, lastName, walletAddress, phone, dateOfBirth, role, isActive, emailVerified)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userData.email,
        hash,
        userData.firstName,
        userData.lastName,
        userData.walletAddress || null,
        userData.phone || null,
        userData.dateOfBirth || null,
        userData.role || 'user',
        userData.isActive !== false,
        userData.emailVerified === true
      ]
    );
    return { id: result.insertId, ...userData, password: undefined };
  } finally {
    conn.release();
  }
};

const findByEmail = async (email) => {
  const conn = await getPool().getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  } finally {
    conn.release();
  }
};

const findByWalletAddress = async (walletAddress) => {
  const conn = await getPool().getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM users WHERE walletAddress = ?', [walletAddress.toLowerCase()]);
    return rows[0] || null;
  } finally {
    conn.release();
  }
};

const comparePassword = async (plain, hash) => bcrypt.compare(plain, hash);

module.exports = {
  createUser,
  findByEmail,
  findByWalletAddress,
  comparePassword,
  getPool
};