const express = require('express');
const router = express.Router();

// Minimal user route for backend health
router.get('/', (req, res) => {
  res.json({ message: 'User endpoint works!' });
});

module.exports = router;
