const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Loan = require('../models/Loan');

// GET /admin/users - Get all users and their loans
router.get('/users', async (req, res) => {
  try {
    // Fetch all users
    const conn = require('../server').pool.getConnection ? await require('../server').pool.getConnection() : null;
    const [users] = await require('../server').pool.query('SELECT * FROM users');
    // For each user, fetch their loans
    const usersWithLoans = await Promise.all(users.map(async user => {
      const loans = await Loan.findLoansByBorrower(user.id);
      return { ...user, loans };
    }));
    if (conn) conn.release();
    res.json(usersWithLoans);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /admin/loans - Get all loan applications
router.get('/loans', async (req, res) => {
  try {
    const conn = require('../server').pool.getConnection ? await require('../server').pool.getConnection() : null;
    const [loans] = await require('../server').pool.query('SELECT * FROM loans');
    if (conn) conn.release();
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /admin/loan/:id/approve - Approve a loan
router.patch('/loan/:id/approve', async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  const loanId = req.params.id;
  try {
    const conn = require('../server').pool.getConnection ? await require('../server').pool.getConnection() : null;
    // Set status to 'approved' and set approvalDate to now
    await require('../server').pool.query(
      'UPDATE loans SET status = ?, approvalDate = ? WHERE id = ?',
      ['approved', new Date(), loanId]
    );
    if (conn) conn.release();
    res.json({ message: 'Loan approved', loanId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /admin/loan/:id/decline - Decline a loan
router.patch('/loan/:id/decline', async (req, res) => {
  const loanId = req.params.id;
  const { rejectionReason } = req.body;
  try {
    const conn = require('../server').pool.getConnection ? await require('../server').pool.getConnection() : null;
    // Set status to 'rejected' and save rejection reason
    await require('../server').pool.query(
      'UPDATE loans SET status = ?, rejectionReason = ? WHERE id = ?',
      ['rejected', rejectionReason || null, loanId]
    );
    if (conn) conn.release();
    res.json({ message: 'Loan declined', loanId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
