const jwt = require('jsonwebtoken');

// VULNERABILITY: Hardcoded JWT secret
const JWT_SECRET = 'hardcoded-jwt-secret-key';

// VULNERABILITY: Weak authentication middleware
function authenticate(req, res, next) {
  const token = req.headers['x-auth-token'] || req.query.token;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    // VULNERABILITY: Not specifying allowed algorithms
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // VULNERABILITY: Verbose error messages
    res.status(401).json({ 
      error: 'Token verification failed',
      details: err.message,
      stack: err.stack  // Exposing stack trace
    });
  }
}

// VULNERABILITY: Broken access control
function isAdmin(req, res, next) {
  // Only checking a client-controlled header
  if (req.headers['x-admin'] === 'true') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
}

module.exports = { authenticate, isAdmin, JWT_SECRET };
