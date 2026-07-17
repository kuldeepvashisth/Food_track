const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWTsecret || process.env.JWT_SECRET || 'secret'
        );

        // token.js creates the payload as: { userId: user._id }
        if (!decoded.userId) {
            return res.status(401).json({ message: 'Invalid authentication token' });
        }

        req.userId = decoded.userId;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired authentication token' });
    }
};

module.exports = isAuth;
