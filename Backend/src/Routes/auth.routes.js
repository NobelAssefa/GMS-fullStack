const express = require('express');
const router = express.Router();
const {registerUser, login, logout, checkAuth} = require('../Controller/Auth.controller');
const {authMiddleware,is_Admin} = require('../Middlewares/authMiddleware');
// ,getProfile,loggedIn,updateProfile,changePassword, resetPassword

router.post('/register',authMiddleware,is_Admin,registerUser);
router.post('/login', login)
router.post('/logout', logout)
router.get('/check-auth', checkAuth)
// router.get('/profile',authMiddleware, getProfile)
// router.post('/loggedin', loggedIn)
// router.patch('/updateprofile', authMiddleware,updateProfile)
// router.patch('/changepassword', authMiddleware,changePassword)
// router.post('/resetpassword',resetPassword)

module.exports = router;