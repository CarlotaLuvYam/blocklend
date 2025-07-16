const express = require('express');
const router = express.Router();

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const User = require('../models/User');
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is disabled. Contact admin.' });
        }
        // Optionally: if admin, check if approved
        if (user.role === 'admin' && user.isApproved === false) {
            return res.status(403).json({ message: 'Admin not approved yet.' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            await user.incLoginAttempts();
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        await user.resetLoginAttempts();
        user.lastLogin = new Date();
        await user.save();
        // Remove sensitive fields
        const userObj = user.toJSON();
        res.json({ message: 'Login successful', user: userObj });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/auth/register
router.post('/register', (req, res) => {
    // Placeholder logic for registration
    res.json({ message: 'Registration successful (mock)' });
});

module.exports = router;
