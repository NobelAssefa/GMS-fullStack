const User = require('../Models/user.model')
const AsyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const Token = require('../Models/token.model')
const sendEmail = require('../Utils/sendEmail')
const generateToken = require("../Utils/generateToken")
const cloudinary = require('../Utils/cloudinary')

//GET USER PROFILE
const getUserById = AsyncHandler(
    async (req, res) => {
        console.log('Getting user with ID:', req.params.id);
        
        const user = await User.findById(req.params.id)
            .populate({
                path: 'role_id',
                select: 'roleName'
            })
            .populate({
                path: 'department_id',
                select: 'departmentName'
            });
            
        console.log('Found user:', user);
        
        if (user) {
            const { _id, fullName, email, phone, status, role_id, department_id, is_Admin, token } = user;
            console.log('Role:', role_id);
            console.log('Department:', department_id);
            
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
            throw new Error("user not found!");
        }
    }
);

const getUsers = AsyncHandler(async (req, res) => {
    const users = await User.find()
        .populate({
            path: 'role_id',
            select: 'roleName'
        })
        .populate({
            path: 'department_id',
            select: 'departmentName'
        });
    res.status(200).json(users);
});

const updateProfile = AsyncHandler(async (req, res) => {
    console.log('Update request received:', {
        body: req.body,
        file: req.file
    });

    const { fullName, email, phone, role_id, department_id, status, is_Admin } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Handle avatar update if there's a new file
    if (req.file) {
        // If user has an existing avatar, delete it from Cloudinary
        if (user.avatar) {
            const publicId = user.avatar.split('/').slice(-1)[0].split('.')[0];
            try {
                await cloudinary.uploader.destroy(`user_avatars/${publicId}`);
            } catch (error) {
                console.error('Error deleting old avatar:', error);
            }
        }
        user.avatar = req.file.path;
    }

    // Update user fields
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.role_id = role_id || user.role_id;
    user.department_id = department_id || user.department_id;
    user.status = status !== undefined ? status : user.status;
    user.is_Admin = is_Admin !== undefined ? is_Admin : user.is_Admin;

    const updatedUser = await user.save();
    
    // Populate role and department information
    const populatedUser = await User.findById(updatedUser._id)
        .populate('role_id', 'roleName')
        .populate('department_id', 'departmentName');

    console.log('Updated user:', populatedUser);
    
    res.status(200).json(populatedUser);
});

const updateUser = AsyncHandler(async (req, res) => {
    const userId = req.params.id;
    console.log('Updating user:', userId);
    console.log('Update data:', req.body);
    console.log('File:', req.file);

    try {
        let updateData = { ...req.body };

        // Handle file upload if there's a new avatar
        if (req.file) {
            // Get the current user to check if they have an existing avatar
            const currentUser = await User.findById(userId);
            if (currentUser.avatar) {
                // Extract public_id from the Cloudinary URL
                const publicId = currentUser.avatar.split('/').slice(-1)[0].split('.')[0];
                // Delete the old image from Cloudinary
                await cloudinary.uploader.destroy(`user_avatars/${publicId}`);
            }
            
            // Set the new avatar URL
            updateData.avatar = req.file.path;
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).populate('role_id', 'roleName')
         .populate('department_id', 'departmentName');

        if (!updatedUser) {
            res.status(404);
            throw new Error('User not found');
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: error.message });
    }
});

const deleteUser = AsyncHandler(async (req, res) => {
    const userId = req.params.id;
    
    try {
        // Get user to check for avatar
        const user = await User.findById(userId);
        
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Delete avatar from Cloudinary if it exists
        if (user.avatar) {
            const publicId = user.avatar.split('/').slice(-1)[0].split('.')[0];
            await cloudinary.uploader.destroy(`user_avatars/${publicId}`);
        }

        // Delete user
        await User.findByIdAndDelete(userId);
        
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = {
    getUserById,
    getUsers,
    updateProfile,
    updateUser,
    deleteUser
};
