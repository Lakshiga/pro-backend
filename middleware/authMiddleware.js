import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token and decode user information
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user information to request object
      req.user = await User.findById(decoded.id).select('-password');

      // Proceed to next middleware
      return next();
    } catch (error) {
      // Handle invalid token
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // Handle missing token
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const adminOnly = (req, res, next) => {
  // Check if user is admin
  if (req.user && req.user.role === 'admin') {
    return next();
  } else {
    // Handle non-admin access attempt
    return res.status(403).json({ message: 'Admin access only' });
  }
};
