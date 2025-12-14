import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('Token verified successfully, userId:', decoded.userId);
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError.name, jwtError.message);
      console.error('Token received:', token.substring(0, 20) + '...');
      return res.status(401).json({ 
        message: 'Invalid token',
        error: jwtError.name === 'TokenExpiredError' ? 'Token expired' : jwtError.message
      });
    }

    if (!decoded.userId) {
      console.error('Token missing userId:', decoded);
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.error('User not found for userId:', decoded.userId);
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Authentication failed', error: error.message });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

