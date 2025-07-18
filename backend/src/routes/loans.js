const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');

const {getPool} =require('../db');

// Dummy data for initial seeding
const dummyLoans = [

  {
    applicantName: "James Taylor",
    amount: 35000,
    status: "Under Review",
    applicationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    email: "james.taylor@example.com",
    phone: "+1234567896"
  },
  {
    applicantName: "Jennifer Martinez",
    amount: 18000,
    status: "Approved",
    applicationDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
    email: "jennifer.martinez@example.com",
    phone: "+1234567897"
  }
];


// Controller methods
const loanController = {
  // Seed database with dummy data
  seedLoans: async (req, res) => {
    try {
      // Check if loans already exist
      const existingLoans = await Loan.countDocuments();
      if (existingLoans > 0) {
        return res.status(200).json({ 
          message: 'Database already contains loan data',
          count: existingLoans 
        });
      }

      // Insert dummy data
      const insertedLoans = await Loan.insertMany(dummyLoans);
      
      res.status(201).json({
        message: 'Dummy loan data inserted successfully',
        count: insertedLoans.length,
        loans: insertedLoans
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error seeding loan data', 
        error: error.message 
      });
    }
  },
};


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
router.post('/loans', async (req, res) => {
  console.log("Loan Data: ", req.body.user);
  try {
    const loanData = req.body;
    loanData.borrower = req.body.user.id;
    // Always set status to 'pending' regardless of what is sent
    loanData.status = 'pending';
    const newLoan = await Loan.createLoan(loanData);
    res.status(201).json(newLoan);
  } catch (error) {
    console.log("Error creating loan: ", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// GET /loans - Get all loans
router.get('/loans', async (req, res) => {
  try {
    console.log("Fetching all loans...");
    
    // Call the getAllLoans function from the Loan model
    const loans = await Loan.getAllLoans();
    
    console.log(`Retrieved ${loans.length} loans`);
    
    // Return the loans data
    res.status(200).json({
      success: true,
      count: loans.length,
      loans: loans
    });
    
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
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




// Add these routes to your routes/loans.js file

// POST /api/loans/:id/approve - Approve a loan
router.post('/loans/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Approving loan ${id}...`);
    
    const conn = await getPool().getConnection();
    
    try {
      // Check if loan exists
      const [existingLoan] = await conn.query(
        'SELECT * FROM loans WHERE id = ?',
        [id]
      );
      
      if (existingLoan.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Loan not found'
        });
      }
      
      // Update loan status to approved
      const [result] = await conn.query(
        'UPDATE loans SET status = "approved", approvalDate = "2024-06-15 10:30:00" WHERE id = 1',
        ['approved', new Date(), id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(400).json({
          success: false,
          message: 'Failed to approve loan'
        });
      }
      
      console.log(`Loan ${id} approved successfully`);
      
      res.status(200).json({
        success: true,
        message: 'Loan approved successfully',
        loanId: id
      });
      
    } finally {
      conn.release();
    }
    
  } catch (error) {
    console.error('Error approving loan:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// POST /api/loans/:id/reject - Reject a loan
router.post('/loans/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Rejecting loan ${id}...`);
    
    const conn = await getPool().getConnection();
    
    try {
      // Check if loan exists
      const [existingLoan] = await conn.query(
        'SELECT * FROM loans WHERE id = ?',
        [id]
      );
      
      if (existingLoan.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Loan not found'
        });
      }
      
      // Update loan status to rejected
      const [result] = await conn.query(
        'UPDATE loans SET status = ? WHERE id = ?',
        ['rejected', id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(400).json({
          success: false,
          message: 'Failed to reject loan'
        });
      }
      
      console.log(`Loan ${id} rejected successfully`);
      
      res.status(200).json({
        success: true,
        message: 'Loan rejected successfully',
        loanId: id
      });
      
    } finally {
      conn.release();
    }
    
  } catch (error) {
    console.error('Error rejecting loan:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// POST /api/loans/:id/disburse - Disburse an approved loan
router.post('/:id/disburse', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Disbursing loan ${id}...`);
    
    const conn = await getPool().getConnection();
    
    try {
      // Check if loan exists and is approved
      const [existingLoan] = await conn.query(
        'SELECT * FROM loans WHERE id = ? AND status = ?',
        [id, 'approved']
      );
      
      if (existingLoan.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Loan not found or not approved'
        });
      }
      
      // Update loan status to active and set disbursement date
      const [result] = await conn.query(
        'UPDATE loans SET status = ?, disbursementDate = ? WHERE id = ?',
        ['active', new Date(), id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(400).json({
          success: false,
          message: 'Failed to disburse loan'
        });
      }
      
      console.log(`Loan ${id} disbursed successfully`);
      
      res.status(200).json({
        success: true,
        message: 'Loan disbursed successfully',
        loanId: id
      });
      
    } finally {
      conn.release();
    }
    
  } catch (error) {
    console.error('Error disbursing loan:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});
module.exports = router;
