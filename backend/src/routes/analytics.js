const express = require('express');
const router = express.Router();

// Minimal analytics route
router.get('/', (req, res) => {
  res.json({ message: 'Analytics endpoint works!' });
});

// Middleware to check admin role
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
}

// GET /api/analytics/summary - Admin analytics summary
router.get('/summary', requireAdmin, async (req, res) => {
  try {
    const db = require('../server').pool.getConnection ? await require('../server').pool.getConnection() : null;
    const [[{ totalLoans }]] = await require('../server').pool.query('SELECT COUNT(*) AS totalLoans FROM loans');
    const [[{ totalPayments }]] = await require('../server').pool.query('SELECT COUNT(*) AS totalPayments FROM payments');
    const [[{ totalUsers }]] = await require('../server').pool.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [loansByStatus] = await require('../server').pool.query('SELECT status, COUNT(*) AS count FROM loans GROUP BY status');
    const [topBorrowers] = await require('../server').pool.query('SELECT borrower, SUM(amount) AS totalBorrowed FROM loans GROUP BY borrower ORDER BY totalBorrowed DESC LIMIT 5');
    if (db) db.release();
    res.json({ totalLoans, totalPayments, totalUsers, loansByStatus, topBorrowers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
