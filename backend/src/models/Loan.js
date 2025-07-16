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
        'pending',
        null,
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

const findLoansByStatus = async (status) => {
  const conn = await getPool().getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM loans WHERE status = ?', [status]);
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
  findOverdueLoans,
  getPool
};

