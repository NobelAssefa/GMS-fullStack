const express = require('express');
const router = express.Router();
const { getUserById,updateProfile,deleteUser, getUsers} = require('../Controller/User.controller');
const {authMiddleware,is_Admin} = require('../Middlewares/authMiddleware');


router.use(authMiddleware)
router.get('/getuserbyid/:id',getUserById);
router.get('/getusers',getUsers);
router.put('/update/:id',updateProfile)
router.put('/delete/:id',deleteUser)

module.exports=router;