const express = require('express');
const router = express.Router();
const {authMiddleware,is_Admin} = require('../Middlewares/authMiddleware');
const {createRole,getRoles,UpdateRole,deleteRole}= require('../Controller/Role.controller')

router.use(authMiddleware)

router.post('/createrole', createRole)
router.get('/getroles', getRoles)
router.put('/updaterole/:id',UpdateRole)
router.put('/deleterole/:id',deleteRole)


module.exports = router;
