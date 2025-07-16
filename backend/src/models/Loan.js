const { pool } = require('../server');

const getPool = () => pool();

// Loan CRUD and query functions
const createLoan = async (loanData) => {
  const conn = await getPool().getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO loans (borrower, loanType, amount, currency, interestRate, term, termUnit, purpose, status, approvalDate, disbursementDate, dueDate, completedDate, monthlyPayment, totalAmount, remainingBalance, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        loanData.borrower,
        loanData.loanType,
        loanData.amount,
        loanData.currency || 'USD',
        loanData.interestRate,
        loanData.term,
        loanData.termUnit || 'months',
        loanData.purpose,
        loanData.status || 'pending',
        loanData.approvalDate || null,
        loanData.disbursementDate || null,
        loanData.dueDate || null,
        loanData.completedDate || null,
        loanData.monthlyPayment || null,
        loanData.totalAmount || null,
        loanData.remainingBalance || loanData.amount,
        loanData.role || 'user'
      ]
    );
    return { id: result.insertId, ...loanData };
  } finally {
    conn.release();
  }
};

const findLoanById = async (id) => {
  const conn = await getPool().getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM loans WHERE id = ?', [id]);
    return rows[0] || null;
  } finally {
    conn.release();
  }
};

const findLoansByBorrower = async (borrowerId) => {
  const conn = await getPool().getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM loans WHERE borrower = ?', [borrowerId]);
    return rows;
  } finally {
    conn.release();
  }
};

const findActiveLoans = async () => {
  const conn = await getPool().getConnection();
  try {
    const [rows] = await conn.query("SELECT * FROM loans WHERE status = 'active'");
    return rows;
  } finally {
    conn.release();
  }
};

const findOverdueLoans = async () => {
  const conn = await getPool().getConnection();
  try {
    const today = new Date();
    const [rows] = await conn.query("SELECT * FROM loans WHERE status = 'active' AND dueDate < ?", [today]);
    return rows;
  } finally {
    conn.release();
  }
};

module.exports = {
  createLoan,
  findLoanById,
  findLoansByBorrower,
  findActiveLoans,
  findOverdueLoans
};
// Virtual for loan progress
loanSchema.virtual('progress').get(function() {
  if (this.status !== 'active' && this.status !== 'completed') return 0;
  const paid = this.amount - this.remainingBalance;
  return Math.round((paid / this.amount) * 100);
});

// Virtual for next payment date
loanSchema.virtual('nextPaymentDate').get(function() {
  if (this.status !== 'active') return null;
  const lastPayment = this.payments
    .filter(p => p.status === 'confirmed')
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  
  if (!lastPayment) return this.disbursementDate;
  
  const nextDate = new Date(lastPayment.date);
  nextDate.setMonth(nextDate.getMonth() + 1);
  return nextDate;
});

// Virtual for days until next payment
loanSchema.virtual('daysUntilNextPayment').get(function() {
  const nextPayment = this.nextPaymentDate;
  if (!nextPayment) return null;
  
  const today = new Date();
  const diffTime = nextPayment - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to calculate loan details
loanSchema.pre('save', function(next) {
  if (this.isModified('amount') || this.isModified('interestRate') || this.isModified('term')) {
    if (this.status === 'approved' || this.status === 'active') {
      // Calculate monthly payment using simple interest formula
      const monthlyRate = this.interestRate / 100 / 12;
      const totalInterest = this.amount * monthlyRate * this.term;
      this.totalAmount = this.amount + totalInterest;
      this.monthlyPayment = this.totalAmount / this.term;
    }
  }
  next();
});

// Instance method to add payment
loanSchema.methods.addPayment = function(amount, transactionHash = null) {
  this.payments.push({
    amount,
    transactionHash,
    status: 'confirmed'
  });
  
  this.remainingBalance = Math.max(0, this.remainingBalance - amount);
  
  if (this.remainingBalance === 0) {
    this.status = 'completed';
    this.completedDate = new Date();
  }
  
  return this.save();
};

// Instance method to calculate late fees
loanSchema.methods.calculateLateFees = function() {
  if (this.status !== 'active') return 0;
  
  const today = new Date();
  const dueDate = this.dueDate || this.nextPaymentDate;
  
  if (!dueDate || today <= dueDate) return 0;
  
  const daysLate = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
  const lateFeeRate = 0.05; // 5% late fee
  const lateFee = this.monthlyPayment * lateFeeRate * Math.floor(daysLate / 30);
  
  return lateFee;
};

// Static method to find active loans
loanSchema.statics.findActiveLoans = function() {
  return this.find({ status: 'active' }).populate('borrower', 'firstName lastName email');
};

// Static method to find overdue loans
loanSchema.statics.findOverdueLoans = function() {
  const today = new Date();
  return this.find({
    status: 'active',
    dueDate: { $lt: today }
  }).populate('borrower', 'firstName lastName email');
};

// JSON serialization
loanSchema.methods.toJSON = function() {
  const loanObject = this.toObject();
  loanObject.progress = this.progress;
  loanObject.nextPaymentDate = this.nextPaymentDate;
  loanObject.daysUntilNextPayment = this.daysUntilNextPayment;
  return loanObject;
};

module.exports = mongoose.model('Loan', loanSchema); 