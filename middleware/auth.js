const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

exports.middleware = (req, res, next) => {
    const authorizationHeader = req.headers.authorization || req.headers.Authorization;

    if (!authorizationHeader) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authorizationHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ error: 'Invalid token.' });
    }
};
