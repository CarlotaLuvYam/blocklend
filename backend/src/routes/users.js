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
  try {
    const { firstName, lastName, email, password, walletAddress } = req.body;
    if (walletAddress) {
      // Wallet-based registration
      if (!firstName || !lastName || !walletAddress) {
        return res.status(400).json({ message: 'Wallet address, first name, and last name are required.' });
      }
      const existing = users.find(u => u.walletAddress === walletAddress);
      if (existing) {
        return res.status(409).json({ message: 'Wallet already registered.' });
      }
      const user = { id: users.length + 1, firstName, lastName, walletAddress };
      users.push(user);
      return res.status(201).json({ id: user.id, firstName, lastName, walletAddress });
    } else {
      // Email/password registration
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
      return res.status(201).json({ id: user.id, firstName, lastName, email });
    }
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password, walletAddress } = req.body;
    if (walletAddress) {
      // Wallet-based login
      const user = users.find(u => u.walletAddress === walletAddress);
      if (!user) {
        return res.status(401).json({ message: 'Wallet not registered.' });
      }
      return res.json({ id: user.id, firstName: user.firstName, lastName: user.lastName, walletAddress: user.walletAddress });
    } else {
      // Email/password login
      const user = users.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      return res.json({ id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
