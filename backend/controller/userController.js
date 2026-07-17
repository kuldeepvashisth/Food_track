const User = require('../models/usermodel');

exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select(
            '-password -resetotp -resetotpExpiry -isverified'
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error('getCurrentUser error:', error);
        return res.status(500).json({ message: 'Unable to get current user' });
    }
};
