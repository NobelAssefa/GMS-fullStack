const express = require('express');
const router = express.Router();
const { getUserById,updateProfile,deleteUser} = require('../Controller/User.controller');
const {authMiddleware,is_Admin} = require('../Middlewares/authMiddleware');


router.use(authMiddleware)
router.get('/getuserbyid/:id', is_Admin,getUserById);
router.put('/update/:id', is_Admin,updateProfile)
router.post('/delete/:id', is_Admin,deleteUser)

module.exports=router;