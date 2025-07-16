const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');

// GET /user/loans - Get all loans for the authenticated user
router.get('/user/loans', async (req, res) => {
  const userId = req.user.id; // Use authenticated user ID
  try {
    const loans = await Loan.findLoansByBorrower(userId);
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /loan - Create a new loan
router.post('/loan', async (req, res) => {
  try {
    const loanData = req.body;
    loanData.borrower = req.user.id;
    // Always set status to 'pending' regardless of what is sent
    loanData.status = 'pending';
    const newLoan = await Loan.createLoan(loanData);
    res.status(201).json(newLoan);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /loan/:id/pay - Make a payment for a loan
router.post('/loan/:id/pay', async (req, res) => {
  const loanId = req.params.id;
  const { amount, transactionHash } = req.body;
  try {
    const loan = await Loan.findLoanById(loanId);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    if (loan.status !== 'approved' && loan.status !== 'active') {
      return res.status(400).json({ message: 'Payments can only be made on approved or active loans' });
    }
    const conn = require('../server').pool.getConnection ? await require('../server').pool.getConnection() : null;
    const newBalance = Math.max(0, loan.remainingBalance - amount);
    const newStatus = newBalance === 0 ? 'completed' : loan.status;
    await require('../server').pool.query('UPDATE loans SET remainingBalance = ?, status = ? WHERE id = ?', [newBalance, newStatus, loanId]);
    // Insert payment record
    await require('../server').pool.query('INSERT INTO payments (loanId, amount, transactionHash, status) VALUES (?, ?, ?, ?)', [loanId, amount, transactionHash || null, 'confirmed']);
    if (conn) conn.release();
    res.json({ message: 'Payment successful', loanId, newBalance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /loan/:id/progress - Get loan progress (percentage paid)
router.get('/loan/:id/progress', async (req, res) => {
  const loanId = req.params.id;
  try {
    const loan = await Loan.findLoanById(loanId);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    const paid = loan.amount - loan.remainingBalance;
    const progress = loan.amount > 0 ? Math.round((paid / loan.amount) * 100) : 0;
    res.json({ loanId, progress });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /loan/:id/late-fee - Get late fee for a loan
router.get('/loan/:id/late-fee', async (req, res) => {
  const loanId = req.params.id;
  try {
    const loan = await Loan.findLoanById(loanId);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    if (!loan.dueDate || loan.status !== 'active') return res.json({ loanId, lateFee: 0 });
    const today = new Date();
    const dueDate = new Date(loan.dueDate);
    if (today <= dueDate) return res.json({ loanId, lateFee: 0 });
    const daysLate = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
    const lateFeeRate = 0.05; // 5% per month
    const lateFee = loan.monthlyPayment ? (loan.monthlyPayment * lateFeeRate * Math.floor(daysLate / 30)) : 0;
    res.json({ loanId, lateFee });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /loan/:id/payments - Get payment history for a specific loan
router.get('/loan/:id/payments', async (req, res) => {
  const loanId = req.params.id;
  try {
    const Payment = require('../models/Payment');
    const payments = await Payment.findPaymentsByLoan(loanId);
    res.json({ loanId, payments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /user/payments - Get payment history for all loans of the authenticated user
router.get('/user/payments', async (req, res) => {
  const userId = req.user.id;
  try {
    const Loan = require('../models/Loan');
    const Payment = require('../models/Payment');
    const loans = await Loan.findLoansByBorrower(userId);
    const loanIds = loans.map(l => l.id);
    let allPayments = [];
    for (const loanId of loanIds) {
      const payments = await Payment.findPaymentsByLoan(loanId);
      allPayments = allPayments.concat(payments.map(p => ({ ...p, loanId })));
    }
    res.json({ userId, payments: allPayments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
