const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || 'blocklend_secret';

router.post('/login', async (req, res) => {
  const { email, password, walletAddress } = req.body;

  try {
    let user = null;
    if (email && password) {
      user = await User.findByEmail(email.toLowerCase());
      if (!user) return res.status(401).json({ message: `Invalid email or password ${email}` });
      if (!user.isActive) return res.status(403).json({ message: 'Account is disabled. Contact admin.' });
      const isMatch = await User.comparePassword(password, user.password);
console.log(isMatch)
     
      if (!isMatch) return res.status(401).json({ message: `&&&Invalid email or password${user.password}	` });

    } else if (walletAddress) {
      user = await User.findByWalletAddress(walletAddress.toLowerCase());
      if (!user) return res.status(401).json({ message: 'Wallet not registered' });
      if (!user.isActive) return res.status(403).json({ message: 'Account is disabled. Contact admin.' });

    } else {
      return res.status(400).json({ message: 'Email/password or walletAddress required' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove sensitive fields
    delete user.password;

    res.json({ message: 'Login successful', token, user });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName, walletAddress, phone, dateOfBirth } = req.body;
  console.log("Email: ", email);
  console.log("Password: ", password);
  console.log("First Name: ", firstName);
  console.log("Last Name: ", lastName);
  console.log("Wallet Address: ", walletAddress);
  console.log("Phone: ", phone);
  console.log("Date of Birth: ", dateOfBirth);
  
  try {
    // Check if user exists
    let existing = null;
    if (email) existing = await User.findByEmail(email.toLowerCase());
    if (!existing && walletAddress) existing = await User.findByWalletAddress(walletAddress.toLowerCase());
    if (existing) return res.status(409).json({ message: 'User already exists' });
    // Create user
    console.log("New User: ", password);

    const newUser = await User.createUser({
      email: email?.toLowerCase(),
      password:password?.toLowerCase(),
      firstName,
      lastName,
      walletAddress: walletAddress?.toLowerCase(),
      phone,
      dateOfBirth,
      role: 'user',
      isActive: true,
      emailVerified: false
    });
    // Create JWT
    const token = jwt.sign({ id: newUser.id, email: newUser.email, walletAddress: newUser.walletAddress, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Registration successful', token, user: { ...newUser, password: undefined } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
