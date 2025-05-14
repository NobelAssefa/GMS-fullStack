const User = require('../Models/user.model')
const Session = require('../Models/session.model')
const AsyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const authMiddleware = AsyncHandler(
    async (req, res, next) => {
        try {
            console.log('Cookies:', req.cookies);
            const token = req.cookies.token;
            
            if (!token) {
                console.log('No token found in cookies');
                return res.status(401).json({
                    isAuthenticated: false,
                    message: "Not authorized, no token"
                });
            }

            // Check if session exists and is active
            const session = await Session.findOne({ token, isActive: true });
            if (!session) {
                console.log('No active session found');
                return res.status(401).json({
                    isAuthenticated: false,
                    message: "Session expired or invalid"
                });
            }

            try {
                console.log('Token found:', token);
                const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
                console.log('Token verified:', decoded);

                // Update session last activity
                await Session.findOneAndUpdate(
                    { token },
                    { lastActivity: new Date() }
                );

                // Check token expiration
                if (decoded.exp * 1000 < Date.now()) {
                    // Deactivate session if token is expired
                    await Session.findOneAndUpdate(
                        { token },
                        { isActive: false }
                    );
                    return res.status(401).json({
                        isAuthenticated: false,
                        message: "Token expired"
                    });
                }

                const user = await User.findById(decoded.id)
                    .populate('role_id', 'roleName')
                    .select("-password");

                if (!user) {
                    console.log('User not found for ID:', decoded.id);
                    return res.status(401).json({
                        isAuthenticated: false,
                        message: "Not authorized, user not found"
                    });
                }

                // Check if user is still active
                if (!user.status) {
                    // Deactivate all user sessions if account is deactivated
                    await Session.updateMany(
                        { userId: user._id },
                        { isActive: false }
                    );
                    return res.status(401).json({
                        isAuthenticated: false,
                        message: "Account is deactivated"
                    });
                }

                req.user = user;
                req.session = session;
                console.log('User authenticated:', req.user._id);
                next();
            } catch (error) {
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({
                        isAuthenticated: false,
                        message: "Invalid token"
                    });
                }
                if (error.name === 'TokenExpiredError') {
                    // Deactivate session if token is expired
                    await Session.findOneAndUpdate(
                        { token },
                        { isActive: false }
                    );
                    return res.status(401).json({
                        isAuthenticated: false,
                        message: "Token expired"
                    });
                }
                throw error;
            }
        } catch (error) {
            console.error('Auth error:', error.message);
            return res.status(401).json({
                isAuthenticated: false,
                message: "Authentication failed"
            });
        }
    }
);

const authorize = (...roles) => {
    return (req, res, next) => {
        console.log('User role:', req.user.role_id?.roleName);
        if (!req.user.role_id || !roles.includes(req.user.role_id.roleName)) {
            return res.status(403).json({
                isAuthenticated: false,
                message: `User role '${req.user.role_id?.roleName || 'undefined'}' is not authorized to access this route`
            });
        }
        next();
    };
};

const is_Admin = AsyncHandler(async (req, res, next) => {
    console.log("Entered is_Admin function");
    
    try {
        if (!req.user) {
            return res.status(401).json({
                isAuthenticated: false,
                message: 'Not authorized, please login'
            });
        }

        if (!req.user.is_Admin) {
            return res.status(403).json({
                isAuthenticated: false,
                message: 'Not authorized as admin'
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            isAuthenticated: false,
            message: 'Not authorized, please login'
        });
    }
});

module.exports = {authMiddleware, is_Admin, authorize};