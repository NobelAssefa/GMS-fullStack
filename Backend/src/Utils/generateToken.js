const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role_id,
            isAdmin: user.is_Admin
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: '1d', // Reduced to 1 day for better security
        }
    );
};

module.exports = generateToken;