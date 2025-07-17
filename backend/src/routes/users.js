const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

// In-memory user store (replace with DB in production)
const users = [];

// Health check
router.get('/', (req, res) => {
  res.json({ message: 'User endpoint works!' });
});

// Registration endpoint
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  const existing = users.find(u => u.email === email);
  if (existing) {
    return res.status(409).json({ message: 'User already exists.' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, firstName, lastName, email, password: hashedPassword };
  users.push(user);
  res.status(201).json({ id: user.id, firstName, lastName, email });
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  res.json({ id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email });
});

module.exports = router;
