const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    
    // Add user data to request
    req.userId = decoded.userId;
    req.role = decoded.role;
    req.isAdmin = decoded.role === 'admin';
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};