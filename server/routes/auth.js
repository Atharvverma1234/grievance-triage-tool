const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, ward } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const approvalStatus = role === 'official' ? 'pending' : 'approved';

    const user = await User.create({ name, email, passwordHash, role, ward, approvalStatus });

    res.status(201).json({ id: user._id, name: user.name, role: user.role, approvalStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

    if (user.role === 'official' && user.approvalStatus === 'pending') {
      return res.status(403).json({ error: 'Your official account is awaiting approval from an existing official.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, ward: user.ward } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;