
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

// Middleware to verify JWT token - RESTRUCTURED
exports.protect = async (req, res, next) => {
    console.log('--- ENTERING PROTECT MIDDLEWARE (RESTRUCTURED) ---');
    
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        console.error('[Protect] Error: No Bearer token found in header.');
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        // 1. Get token from header
        const token = req.headers.authorization.split(' ')[1];
        console.log('[Protect] Token found:', token);

        // 2. Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('[Protect] Token decoded successfully:', decoded);
        
        // 3. Attach user to the request
        const user = await User.findById(decoded.user.id).select('-password');
        
        if (!user) {
            console.error('[Protect] Error: User from token not found in DB.');
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        
        req.user = user;
        console.log('[Protect] Authorization successful. Calling next()...');
        next(); // Move to the next middleware (isAdmin)

    } catch (error) {
        console.error('[Protect] Error caught:', error.name, '-', error.message);
        // This will catch expired tokens, malformed tokens, etc.
        return res.status(401).json({ message: 'Not authorized, token is invalid or expired' });
    }
};

// Middleware to check for admin role - RESTRUCTURED
exports.isAdmin = (req, res, next) => {
    console.log('--- ENTERING ISADMIN MIDDLEWARE (RESTRUCTURED) ---');
    
    // The 'protect' middleware should always run first and attach 'req.user'
    if (req.user && req.user.role === 'admin') {
        console.log('[isAdmin] Role is "admin". Access granted.');
        next(); // Move to the final controller function
    } else {
        console.error('[isAdmin] Error: User is not an admin or user object is missing.');
        return res.status(403).json({ message: 'Forbidden: You do not have admin privileges' });
    }
};
