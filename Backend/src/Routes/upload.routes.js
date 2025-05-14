const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authMiddleware } = require('../Middlewares/authMiddleware');
const { uploadImage } = require('../Controller/Upload.controller');

// Configure multer for memory storage
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Apply auth middleware to all routes
router.use(authMiddleware);

// Route for image upload
router.post('/image', upload.single('file'), uploadImage);

module.exports = router; 