const jwt= require('jsonwebtoken');
const User = require('../models/user.model.js'); // Adjust the path as needed



const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token; // Assuming you're using cookies to store the token

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key here
        req.user = await User.findById(decoded.id).select('-password'); // Assuming you have a user ID in the token payload
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}
module.exports = authMiddleware;