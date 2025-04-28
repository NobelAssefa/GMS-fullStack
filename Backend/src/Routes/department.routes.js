const express = require('express');
const router = express.Router();
const {authMiddleware,is_Admin} = require('../Middlewares/authMiddleware');
const { createDepartment, getDepartment, getSingleDepartment, updateDepartment, deleteDepartment } = require('../Controller/Department.controller');
-

router.use(authMiddleware);

router.post('/createdepartment',createDepartment)
router.get('/getdepartments',getDepartment)
router.get('/getsingledepartment/:id',getSingleDepartment);
router.put('/updatedepartment/:id',updateDepartment)
router.put('deletedepartment/:id',deleteDepartment)


module.exports = router;