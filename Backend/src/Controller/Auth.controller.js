const User = require('../Models/user.model')
const AsyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const Token = require('../Models/token.model')
const sendEmail = require('../Utils/sendEmail')
const generateToken = require("../Utils/generateToken")
const { is_Admin } = require('../Middlewares/authMiddleware')
//USER REGISTRATION
const registerUser = AsyncHandler(
    async (req, res) => {
        const { fullName, email, password, phone, status, role_id, department_id, is_Admin } = req.body;

        if (!fullName || !email || !password) {
            res.status(400);
            throw new Error("Please fill all required forms");
        }
        if (password.length < 6) {
            res.status(400);
            throw new Error("password must be greater than 6 characters");
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            res.status(400);
            throw new Error("email is already registerd!");
        }

        // Create user with role and department IDs
        const user = await User.create({
            fullName,
            email,
            password,
            phone,
            status,
            role_id,
            department_id,
            is_Admin
        });

        const token = generateToken(user._id);

        //SENDING HTTPONLY COOKIE
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), // 1day
            sameSite: 'none',
            secure: true
        });

        if (user) {
            // Populate role and department before sending response
            const populatedUser = await User.findById(user._id)
                .populate('role_id', 'roleName')
                .populate('department_id', 'departmentName');

            const { _id, fullName, email, phone, status, role_id, department_id, is_Admin } = populatedUser;
            res.status(201).json({
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
                token
            });
        } else {
            res.status(400);
            throw new Error("Invalid user!");
        }
    }
);

// LOGIN
const login = AsyncHandler(
    async (req, res) => {
        const { email, password } = req.body;
        console.log('Login attempt for:', email); // Debug: Log login attempt
        
        if (!email || !password) {
            res.status(400);
            throw new Error("please enter user credentials");
        }

        // check if a user exists
        const user = await User.findOne({ email })
            .populate('role_id', 'roleName')
            .populate('department_id', 'departmentName');
            
        console.log('User found:', user ? 'Yes' : 'No'); // Debug: Log if user exists

        if (!user) {
            res.status(400);
            throw new Error('user not found, please signup');
        }
        
        const passwordExists = await bcrypt.compare(password, user.password);
        console.log('Password match:', passwordExists); // Debug: Log password match

        if (!passwordExists) {
            res.status(401);
            throw new Error('Invalid email or password');
        }
        const token = generateToken(user._id);
        console.log('Generated token:', token); // Debug: Log generated token

        //SENDING HTTPONLY COOKIE
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), // 1day
            sameSite: 'none',
            secure: true
        });
        console.log('Cookie set with token'); // Debug: Log cookie setting

        if (user && passwordExists) {
            const { _id, fullName, email, phone, status, role_id, department_id, is_Admin } = user;
            console.log('Login successful for:', email); // Debug: Log successful login
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
                token
            });
        } else {
            res.status(400);
            throw new Error('Invalid credentials');
        }
    }
);

//LOGOUT
const logout = AsyncHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    })
    return res.status(200).json({ message: "successfuly logged out!!!!!" })


})




// Checking loggedin status
const loggedIn = AsyncHandler(async (req, res) => {

    const token = req.cookies.token;
    if (!token) {
        res.json(false)
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    if (verified) {
        res.json(true)
    } else {
        res.json(true)
    }

})


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
        if (!token) {
            return res.status(401).json({ isAuthenticated: false });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(verified.id).select("-password");
        
        if (!user) {
            return res.status(401).json({ isAuthenticated: false });
        }

        res.status(200).json({
            isAuthenticated: true,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                status: user.status
            }
        });
    } catch (error) {
        res.status(401).json({ isAuthenticated: false });
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
