// ======================================================
// Authentication Middleware
// ======================================================
// JWT verification and role-based access control
// ======================================================

const jwt = require('jsonwebtoken');

// JWT Secret (must match controller)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Verify JWT token and attach user to request
 * Usage: Add as middleware to protected routes
 */
exports.verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login.'
      });
    }
    
    // Expected format: "Bearer <token>"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format. Expected: Bearer <token>'
      });
    }
    
    const token = parts[1];
    
    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            message: 'Token expired. Please login again.'
          });
        }
        
        return res.status(401).json({
          success: false,
          message: 'Invalid token. Please login again.'
        });
      }
      
      // Attach user info to request
      req.user = decoded;
      next();
    });
    
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

/**
 * Check if user has required role
 * Usage: verifyRole(['admin', 'faculty'])
 */
exports.verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // User info should be attached by verifyToken middleware
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
      
      const userRole = req.user.role;
      
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
        });
      }
      
      next();
    } catch (error) {
      console.error('Role verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization failed'
      });
    }
  };
};

/**
 * Optional authentication - attach user if token exists
 * Useful for routes that work for both authenticated and unauthenticated users
 */
exports.optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next();
    }
    
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next();
    }
    
    const token = parts[1];
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (!err) {
        req.user = decoded;
      }
      next();
    });
    
  } catch (error) {
    // Ignore errors for optional auth
    next();
  }
};
