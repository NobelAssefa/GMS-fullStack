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
                throw new Error("You're not authorized")
            }

            console.log('Token found:', token); // Debug: Log the token
            //verify token
            const verified = jwt.verify(token, process.env.JWT_SECRET_KEY)
            console.log('Token verified:', verified); // Debug: Log verification result
            
            req.user = await User.findById(verified.id).select("-password")
            if (!req.user) {
                console.log('User not found for ID:', verified.id); // Debug: Log when user not found
                res.status(401)
                throw new Error("User Not Found")
            }

            console.log('User authenticated:', req.user._id); // Debug: Log successful auth
            next();
        } catch (error) {
            console.error('Auth error:', error.message); // Debug: Log any errors
            res.status(401)
            throw new Error("Not authenticated, please login !!")
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
    const user = await User.findById(req.user._id).populate("-password")
    if (!user) {
        res.status(401)
        throw new Error("User Not Found")
    }
    if(user.role_id.role_name === "Admin"){
        next
    }
    else{
        res.status(401);
        throw new Error("Access Denied: Admins only")
    }
})




module.exports = {authMiddleware,is_Admin,authorize};