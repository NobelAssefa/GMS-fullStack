const User = require('../Models/user.model')
const AsyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const Token = require('../Models/token.model')
const sendEmail = require('../Utils/sendEmail')
const generateToken = require("../Utils/generateToken")

//GET USER PROFILE
const getUserById = AsyncHandler(
    async (req, res) => {
        const user = await User.findById(req.user._id)
        if (user) {
            const { _id, fullName, email, phone, status, token } = user
            res.status(200).json({
                _id, fullName, email, phone, status, token
            })
        } else {
            res.status(400);
            throw new Error("user not found!")
        }

    });
const getUsers = AsyncHandler(async (req,res)=>{
    const users = await User.find();
    res.status(200).json(users);

})
    
const updateProfile = AsyncHandler(async (req, res) => {
    const { fullName, phone, role_id, department_id, status } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.fullName = fullName || user.fullName;
    user.phone = phone || user.phone;
    user.role_id = role_id || user.role_id;
    user.department_id = department_id || user.department_id;
    user.status = status !== undefined ? status : user.status;
    const updatedUser = await user.save();
    console.log("Updated user", updatedUser);
    
    res.status(200).json(updatedUser);

})

const deleteUser = AsyncHandler(async (req,res)=>{
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
  
    await user.deleteOne();
    res.status(200).json({ message: 'User removed successfully' });
});

module.exports = {
    getUserById,
    getUsers,
    updateProfile,
    deleteUser


}
