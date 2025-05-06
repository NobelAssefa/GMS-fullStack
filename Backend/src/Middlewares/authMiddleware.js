const User = require('../Models/user.model')
const AsyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const authMiddleware = AsyncHandler(
    async (req, res, next) => {
        try {
            console.log('Cookies:', req.cookies); // Debug: Log all cookies
            const token = req.cookies.token
            if (!token) {
                console.log('No token found in cookies'); // Debug: Log when no token
                res.status(401);
                throw new Error("Not authorized, no token")
            }

            console.log('Token found:', token); // Debug: Log the token
            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            console.log('Token verified:', decoded); // Debug: Log verification result
            
            req.user = await User.findById(decoded.id).select("-password")
            if (!req.user) {
                console.log('User not found for ID:', decoded.id); // Debug: Log when user not found
                res.status(401)
                throw new Error("Not authorized, user not found")
            }

            console.log('User authenticated:', req.user._id); // Debug: Log successful auth
            next();
        } catch (error) {
            console.error('Auth error:', error.message); // Debug: Log any errors
            res.status(401)
            throw new Error("Not authorized, please login")
        }
    }
);

const authorize = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        res.status(403);
        throw new Error(`User role '${req.user.role}' is not authorized to access this route`);
      }
      next();
    };
  };

const is_Admin = AsyncHandler(async (req, res, next) => {
    console.log("Entered is_Admin function");
    
    try {
        if (!req.user) {
            res.status(401);
            throw new Error('Not authorized, please login');
        }

        if (!req.user.is_Admin) {
            res.status(403);
            throw new Error('Not authorized as admin');
        }

        next();
    } catch (error) {
        res.status(401);
        throw new Error('Not authorized, please login');
    }
});

module.exports = {authMiddleware, is_Admin, authorize};