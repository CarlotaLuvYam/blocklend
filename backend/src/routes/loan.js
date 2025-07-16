const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');

// GET /user/loans - Get all loans for the authenticated user (mock userId for now)
router.get('/user/loans', async (req, res) => {
  // In production, get userId from auth/session
  const userId = req.query.userId || 1; // Replace with real user id
  try {
    const loans = await Loan.findLoansByBorrower(userId);
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /loan/:id/pay - Make a payment for a loan
router.post('/loan/:id/pay', async (req, res) => {
  const loanId = req.params.id;
  const { amount } = req.body;
  try {
    // Get the loan
    const loan = await Loan.findLoanById(loanId);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    if (loan.status !== 'approved' && loan.status !== 'active') {
      return res.status(400).json({ message: 'Payments can only be made on approved or active loans' });
    }
    // Update remaining balance
    const conn = require('../server').pool.getConnection ? await require('../server').pool.getConnection() : null;
    const newBalance = Math.max(0, loan.remainingBalance - amount);
    await require('../server').pool.query('UPDATE loans SET remainingBalance = ?, status = ? WHERE id = ?', [newBalance, newBalance === 0 ? 'completed' : loan.status, loanId]);
    // Optionally, insert payment record into a payments table
    if (conn) conn.release();
    res.json({ message: 'Payment successful', loanId, newBalance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
