const { getPool } = require('../db');

const createPayment = async (paymentData) => {
  const conn = await getPool().getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO payments (loanId, amount, transactionHash, status) VALUES (?, ?, ?, ?)`,
      [paymentData.loanId, paymentData.amount, paymentData.transactionHash || null, paymentData.status || 'confirmed']
    );
    return { id: result.insertId, ...paymentData };
  } finally {
    conn.release();
  }
};

const findPaymentsByLoan = async (loanId) => {
  const conn = await getPool().getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM payments WHERE loanId = ?', [loanId]);
    return rows;
  } finally {
    conn.release();
  }
};

module.exports = {
  createPayment,
  findPaymentsByLoan,
  getPool
};
