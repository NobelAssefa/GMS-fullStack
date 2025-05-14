const express = require('express');
const router = express.Router();
const {registerUser, login, logout, checkAuth} = require('../Controller/Auth.controller');
const {authMiddleware,is_Admin} = require('../Middlewares/authMiddleware');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../Utils/cloudinary');
// ,getProfile,loggedIn,updateProfile,changePassword, resetPassword

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user_avatars',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 500, height: 500, crop: 'fill' }]
    }
});

// Configure multer
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

router.post('/register', upload.single('avatar'), registerUser);
router.post('/login', login)
router.post('/logout', logout)
router.get('/check-auth', checkAuth)
// router.get('/profile',authMiddleware, getProfile)
// router.post('/loggedin', loggedIn)
// router.patch('/updateprofile', authMiddleware,updateProfile)
// router.patch('/changepassword', authMiddleware,changePassword)
// router.post('/resetpassword',resetPassword)

module.exports = router;