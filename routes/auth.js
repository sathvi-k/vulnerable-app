const express = require('express');
const router = express.Router();
const crypto = require('../utils/crypto');

// Simulated user database
const users = [];

// VULNERABILITY: No input validation
router.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  
  // No validation of input length, format, or content
  const hashedPassword = crypto.hashPassword(password);
  
  users.push({
    id: users.length + 1,
    username,
    password: hashedPassword,
    email
  });
  
  res.json({ message: 'User registered', userId: users.length });
});

// VULNERABILITY: Timing attack on login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = crypto.hashPassword(password);
  
  const user = users.find(u => u.username === username);
  
  // Timing attack: Different response times for existing vs non-existing users
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Direct string comparison instead of constant-time comparison
  if (user.password !== hashedPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json({ message: 'Login successful', sessionId: crypto.generateSessionId() });
});

// VULNERABILITY: Mass assignment
router.put('/profile', (req, res) => {
  const userId = req.body.userId;
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Dangerous: Directly assigning all request body properties to user
  Object.assign(user, req.body);
  
  res.json({ message: 'Profile updated', user });
});

// VULNERABILITY: IDOR (Insecure Direct Object Reference)
router.get('/user/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  // No authorization check - any user can access any profile
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Exposing sensitive data including hashed password
  res.json(user);
});

module.exports = router;
