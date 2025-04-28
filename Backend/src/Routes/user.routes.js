const express = require('express');
const router = express.Router();
const { getUserById,updateProfile,deleteUser} = require('../Controller/User.controller');
const {authMiddleware,is_Admin} = require('../Middlewares/authMiddleware');


router.use(authMiddleware)
router.get('/getuserbyid/:id',getUserById);
router.put('/update/:id',updateProfile)
router.put('/delete/:id',deleteUser)

module.exports=router;