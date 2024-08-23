const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtKey = process.env.JWT_SECRET_KEY

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; 

  if (!token) {
    console.log('hello form teh toen not found')
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, jwtKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is admin
const verifyAdmin = (req, res, next) => {
  const token = req.cookies.token; // Extract token from HTTP cookie

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, jwtKey);
    const isAdmin = decoded.isAdmin; // Extract isAdmin from the decoded token
    if (isAdmin !== true) {
      return res.status(403).json({ message: 'Access denied: Admin rights required' });
    }


    next();
  } catch (error) {
    console.log('catch error')
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { verifyToken, verifyAdmin };
