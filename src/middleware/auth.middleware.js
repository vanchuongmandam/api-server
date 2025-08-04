
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

// Middleware to verify JWT and protect routes
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // Attach user to the request, excluding the password
            req.user = await User.findById(decoded.user.id).select('-password');
            
            if (!req.user) {
                // This case is rare if the token is valid, but good to have
                // e.g., user was deleted after the token was issued.
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            
            next();

        } catch (error) {
            console.error('Authentication Error:', error.name, '-', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware to check for admin role
exports.isAdmin = (req, res, next) => {
    // 'protect' middleware must run before this, so req.user should exist.
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        // We log this as an error because it's a potential security/logic issue.
        // A non-admin user should ideally not be able to reach a route guarded by this.
        console.error(`Forbidden Access Attempt: User '${req.user ? req.user.username : 'Unknown'}' tried to access an admin-only route.`);
        return res.status(403).json({ message: 'Forbidden: You do not have the required admin privileges.' });
    }
};
