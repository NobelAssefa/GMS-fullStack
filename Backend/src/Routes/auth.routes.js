const express = require('express');
const router = express.Router();
const {registerUser,login,logout} = require('../Controller/Auth.controller');
const authMiddleware = require('../Middlewares/authMiddleware');
// ,getProfile,loggedIn,updateProfile,changePassword, resetPassword
router.post('/register', registerUser);
router.post('/login', login)
router.post('/logout', logout)
// router.get('/profile',authMiddleware, getProfile)
// router.post('/loggedin', loggedIn)
// router.patch('/updateprofile', authMiddleware,updateProfile)
// router.patch('/changepassword', authMiddleware,changePassword)
// router.post('/resetpassword',resetPassword)

module.exports = router;