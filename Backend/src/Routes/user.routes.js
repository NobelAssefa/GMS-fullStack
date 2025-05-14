const express = require('express');
const router = express.Router();
const { getUserById, updateProfile, deleteUser, getUsers } = require('../Controller/User.controller');
const { authMiddleware, is_Admin } = require('../Middlewares/authMiddleware');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../Utils/cloudinary');

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

// Apply authentication middleware to all routes
router.use(authMiddleware);

// User routes
router.get('/getusers', getUsers);
router.get('/getuserbyid/:id', getUserById);
router.put('/update/:id', upload.single('avatar'), updateProfile);
router.delete('/delete/:id', is_Admin, deleteUser);

module.exports = router;