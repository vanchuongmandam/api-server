
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

// Middleware to verify JWT token
exports.protect = async (req, res, next) => {
    console.log('--- ENTERING PROTECT MIDDLEWARE ---');
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Get token from header
            token = req.headers.authorization.split(' ')[1];
            console.log('[Protect] Token found:', token);

            // 2. Verify token
            const decoded = jwt.verify(token, JWT_SECRET);
            console.log('[Protect] Token decoded successfully:', decoded);
            
            // 3. Attach user to the request
            req.user = await User.findById(decoded.user.id).select('-password');
            console.log('[Protect] User found in DB:', req.user);
            
            if (!req.user) {
                console.error('[Protect] Error: User from token not found in DB.');
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            
            console.log('[Protect] Authorization successful. Calling next()...');
            next(); // <--- Success, move to the next middleware (isAdmin)

        } catch (error) {
            console.error('[Protect] Error caught:', error.name, '-', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        console.error('[Protect] Error: No token found in header.');
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware to check for admin role
exports.isAdmin = (req, res, next) => {
    console.log('--- ENTERING ISADMIN MIDDLEWARE ---');
    console.log('[isAdmin] Checking user role:', req.user);

    if (req.user && req.user.role === 'admin') {
        console.log('[isAdmin] Role is "admin". Access granted. Calling next()...');
        next(); // <--- Success, move to the final controller function
    } else {
        console.error('[isAdmin] Error: User is not an admin.');
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};
