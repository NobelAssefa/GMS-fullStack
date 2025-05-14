const User = require('../Models/user.model')
const Session = require('../Models/session.model')
const AsyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const Token = require('../Models/token.model')
const sendEmail = require('../Utils/sendEmail')
const generateToken = require("../Utils/generateToken")
const { is_Admin } = require('../Middlewares/authMiddleware')
// Cloudinary and Multer
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../Utils/cloudinary');
const Role = require('../Models/userRole.model');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_avatars',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});
const upload = multer({ storage: storage });

//USER REGISTRATION
const registerUser = AsyncHandler(
    async (req, res) => {
        console.log('Registration request received');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        console.log('Request files:', req.files);

        const { fullName, email, password, phone, status, role_id, department_id, is_Admin } = req.body;

        if (!fullName || !email || !password || !role_id) {
            res.status(400);
            throw new Error("Please fill all required fields");
        }
        if (password.length < 6) {
            res.status(400);
            throw new Error("password must be greater than 6 characters");
        }

        // Check if user exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            res.status(400);
            throw new Error("email is already registered!");
        }

        // Get the role to check if it's DIRECTOR
        const role = await Role.findById(role_id);
        if (!role) {
            res.status(400);
            throw new Error("Invalid role selected");
        }

        // Validate department requirement based on role
        if (role.roleName === 'DIRECTOR' && !department_id) {
            res.status(400);
            throw new Error("Department is required for Director role");
        }

        // Get avatar URL from Cloudinary if file uploaded
        let avatarUrl = "";
        if (req.file) {
            console.log("File upload details:", {
                fieldname: req.file.fieldname,
                originalname: req.file.originalname,
                path: req.file.path,
                cloudinaryUrl: req.file.path
            });
            avatarUrl = req.file.path;
            console.log("Setting avatar URL to:", avatarUrl);
        } else {
            console.log("No file detected in request");
        }
        
        // Create user with all fields including avatar
        const userData = {
            fullName,
            email,
            password,
            phone,
            status: status === 'true' || status === true,
            role_id,
            department_id: role.roleName === 'DIRECTOR' ? department_id : null, // Only set department for DIRECTOR
            is_Admin: is_Admin === 'true' || is_Admin === true,
            avatar: avatarUrl
        };
        console.log("Creating user with data:", { 
            ...userData, 
            password: '[HIDDEN]',
            avatar: userData.avatar // Explicitly log avatar field
        });

        const user = await User.create(userData);
        console.log("User created:", user._id);
        console.log("Created user avatar field:", user.avatar);

        if (user) {
            // Populate role and department before sending response
            const populatedUser = await User.findById(user._id)
                .populate('role_id', 'roleName')
                .populate('department_id', 'departmentName');

            const { _id, fullName, email, phone, status, role_id, department_id, is_Admin, avatar } = populatedUser;
            const response = {
                _id,
                fullName,
                email,
                phone,
                status,
                role: role_id ? {
                    _id: role_id._id,
                    roleName: role_id.roleName
                } : null,
                department: department_id ? {
                    _id: department_id._id,
                    departmentName: department_id.departmentName
                } : null,
                is_Admin,
                avatar
            };
            console.log("Sending response:", response);
            res.status(201).json(response);
        } else {
            res.status(400);
            throw new Error("Invalid user data!");
        }
    }
);

// LOGIN
const login = AsyncHandler(
    async (req, res) => {
        const { email, password } = req.body;
        console.log('Login attempt for:', email);
        
        if (!email || !password) {
            res.status(400);
            throw new Error("please enter user credentials");
        }

        // check if a user exists
        const user = await User.findOne({ email })
            .populate('role_id', 'roleName')
            .populate('department_id', 'departmentName');
            
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            res.status(400);
            throw new Error('user not found, please signup');
        }
        
        const passwordExists = await bcrypt.compare(password, user.password);
        console.log('Password match:', passwordExists);

        if (!passwordExists) {
            res.status(401);
            throw new Error('Invalid email or password');
        }

        const token = generateToken(user);
        console.log('Generated token:', token);

        // Create a new session
        const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
        await Session.create({
            userId: user._id,
            token,
            deviceInfo,
            lastActivity: new Date(),
            isActive: true
        });

        // Enhanced cookie settings
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
        });

        if (user && passwordExists) {
            const { _id, fullName, email, phone, status, role_id, department_id, is_Admin } = user;
            console.log('Login successful for:', email);
            res.status(200).json({
                _id,
                fullName,
                email,
                phone,
                status,
                role: role_id ? {
                    _id: role_id._id,
                    roleName: role_id.roleName
                } : null,
                department: department_id ? {
                    _id: department_id._id,
                    departmentName: department_id.departmentName
                } : null,
                is_Admin,
                tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
            });
        } else {
            res.status(400);
            throw new Error('Invalid credentials');
        }
    }
);

//LOGOUT
const logout = AsyncHandler(async (req, res) => {
    try {
        const token = req.cookies.token;
        if (token) {
            // Deactivate the session
            await Session.findOneAndUpdate(
                { token },
                { isActive: false }
            );
        }

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        
        return res.status(200).json({ message: "Successfully logged out" });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ message: "Logout failed" });
    }
});

// Checking loggedin status
const loggedIn = AsyncHandler(async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(200).json({ isLoggedIn: false });
        }

        // Check if session exists and is active
        const session = await Session.findOne({ token, isActive: true });
        if (!session) {
            return res.status(200).json({ isLoggedIn: false });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (verified) {
            // Update last activity
            await Session.findOneAndUpdate(
                { token },
                { lastActivity: new Date() }
            );

            // Check if user still exists and is active
            const user = await User.findById(verified.id).select('status');
            if (user && user.status) {
                return res.status(200).json({ isLoggedIn: true });
            }
        }
        
        return res.status(200).json({ isLoggedIn: false });
    } catch (error) {
        console.error('Login check error:', error);
        return res.status(200).json({ isLoggedIn: false });
    }
});

const changePassword = AsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    const { oldpassword, password } = req.body;

    if (!user) {
        res.status(400);
        throw new Error("user not found, please signup!")
    }
    if (!oldpassword || !password) {
        res.status(400)
        throw new Error('please add old and new password!!')
    }

    const verifiedPassword = await bcrypt.compare(oldpassword, user.password);
    if (user && verifiedPassword) {
        user.password = password
        user.save()
        res.status(200).send('Password changed successfuly!!!!!')
    } else {
        res.status(400)
        throw new Error("Old password is not correct!!")
    }
});
const resetPassword = AsyncHandler(async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        res.status(400)
        throw new Error("user not found!!")
    }

    //generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex") + user._id;

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    await new Token({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * (60 * 1000) // Thirty Minutes
    }).save()

    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`
    const message = `
        <h1>Hello</h1>
        <p>You requested for a password reset</p>
        <p><Please use the link below to reset a password/p>
        <p>The reset link is only valid for 30 minutes</p>
        <a href = ${resetUrl} clicktracking = false>${resetUrl}</a>
        <p>Regards.....</p>
        <p>DAMASCUS</p>
    `;

    const subject = "Password reset request"
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;

    try {
        await sendEmail(subject, message, send_to, sent_from)
        res.status(200).json({ success: true, message: "Reset Email sent" })

    } catch {
        res.status(500);
        throw new Error("Email not sent please try again!!");

    }



})

const checkAuth = AsyncHandler(async (req, res) => {
    try {
        const token = req.cookies.token;
        console.log('Checking auth with token:', token ? 'Present' : 'Not present');
        
        if (!token) {
            console.log('No token found');
            return res.status(401).json({ 
                isAuthenticated: false,
                message: 'No authentication token found'
            });
        }

        // Check if session exists and is active
        const session = await Session.findOne({ token, isActive: true });
        if (!session) {
            console.log('No active session found');
            return res.status(401).json({ 
                isAuthenticated: false,
                message: 'Session expired or invalid'
            });
        }

        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log('Token verification result:', verified);

            // Update session last activity
            await Session.findOneAndUpdate(
                { token },
                { lastActivity: new Date() }
            );

            // Check token expiration
            if (verified.exp * 1000 < Date.now()) {
                console.log('Token expired');
                return res.status(401).json({ 
                    isAuthenticated: false,
                    message: 'Token expired'
                });
            }

            const user = await User.findById(verified.id)
                .populate('role_id', 'roleName')
                .populate('department_id', 'departmentName')
                .select("-password");
            
            if (!user) {
                console.log('User not found');
                return res.status(401).json({ 
                    isAuthenticated: false,
                    message: 'User not found'
                });
            }

            // Check if user is still active
            if (!user.status) {
                console.log('User account deactivated');
                return res.status(401).json({ 
                    isAuthenticated: false,
                    message: 'Account is deactivated'
                });
            }

            console.log('Authentication successful for user:', user.email);
            res.status(200).json({
                isAuthenticated: true,
                user: {
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    status: user.status,
                    role: user.role_id ? {
                        _id: user.role_id._id,
                        roleName: user.role_id.roleName
                    } : null,
                    department: user.department_id ? {
                        _id: user.department_id._id,
                        departmentName: user.department_id.departmentName
                    } : null,
                    is_Admin: user.is_Admin,
                    avatar: user.avatar
                }
            });
        } catch (error) {
            console.error('Token verification error:', error.message);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ 
                    isAuthenticated: false,
                    message: 'Invalid token'
                });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    isAuthenticated: false,
                    message: 'Token expired'
                });
            }
            throw error;
        }
    } catch (error) {
        console.error('Auth check error:', error);
        return res.status(401).json({ 
            isAuthenticated: false,
            message: 'Authentication check failed'
        });
    }
});

module.exports = {
    registerUser,
    login,
    logout,
    loggedIn,
    changePassword,
    resetPassword,
    checkAuth
};
