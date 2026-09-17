import User from '../models/usermodel.js';

export const getCurrentUser = async (req, res) => {
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

export const updateUserLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const userId = req.userId;

        if (latitude == null || longitude == null) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            { location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            }},

            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'Location updated successfully', user });
    } catch (error) {
        console.error('Error updating user location:', error);
        return res.status(500).json({ message: 'Unable to update user location' });
    }
}
   