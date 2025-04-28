const User = require('../Models/user.model')
const AsyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const authMiddleware = AsyncHandler(
    async (req, res, next) => {
        try {
            const token = req.cookies.token
            if (!token) {
                res.status(401);
                throw new Error("You're not authorized")
            }

            //verify token
            const verified = jwt.verify(token, process.env.JWT_SECRET_KEY)
            req.user = await User.findById(verified.id).select("-password")
            if (!req.user) {
                res.status(401)
                throw new Error("User Not Found")
            }

            next();
        } catch {
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