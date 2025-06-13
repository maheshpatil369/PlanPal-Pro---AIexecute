const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // else if (req.cookies.token) { // Alternative: check for token in cookies
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, msg: 'Not authorized to access this route (no token)' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
        return res.status(401).json({ success: false, msg: 'Not authorized to access this route (user not found)' });
    }

    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ success: false, msg: 'Not authorized to access this route (token invalid)' });
  }
};

// Grant access to specific roles (example, not used yet for trips)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) { // Assuming User model has a 'role' field
      return res.status(403).json({ success: false, msg: `User role ${req.user.role} is not authorized to access this route`});
    }
    next();
  };
};