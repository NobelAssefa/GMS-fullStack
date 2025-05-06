const express = require('express');
const router = express.Router();
const { authMiddleware, is_Admin } = require('../Middlewares/authMiddleware');
const { createDepartment, getDepartment, getSingleDepartment, updateDepartment, deleteDepartment } = require('../Controller/Department.controller');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create a new department (admin only)
router.post('/createdepartment', is_Admin, createDepartment);

// Get all departments (authenticated users)
router.get('/getdepartments', getDepartment);

// Get a single department (authenticated users)
router.get('/:id', getSingleDepartment);

// Update a department (admin only)
router.put('/:id', is_Admin, updateDepartment);

// Delete a department (admin only)
router.delete('/:id', is_Admin, deleteDepartment);

module.exports = router;