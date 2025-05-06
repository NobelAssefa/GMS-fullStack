const AsyncHandler = require('express-async-handler');
const Department = require('../Models/Department.model');


const createDepartment = AsyncHandler(async (req,res)=>{
    const {departmentName, description}= req.body;
    const departmentExist = await Department.findOne({departmentName})
    if(departmentExist){
        res.status(400);
        throw new Error('department already registerd')
    }

    const department = await Department.create({departmentName, description});
    res.status(201).json(department)

});

const getDepartment = AsyncHandler (async (req,res)=>{
    const department = await Department.find()
    res.status(200).json(department)
})

const getSingleDepartment  = AsyncHandler(async (req,res)=>{
    const department = await Department.findById(req.params.id)
    if(department){
        res.status(200).json(department);

    }else{
        res.status(400);
        throw new Error('no department found!')
    }

});

const updateDepartment = AsyncHandler(async (req,res)=>{
    const {departmentName, description} = req.body;
    const departmentExist = await Department.findById(req.params.id)
    if(!departmentExist){
        res.status(404)
        throw new Error('No department found!')
    }

    // Check if the new name conflicts with another department
    if (departmentName && departmentName !== departmentExist.departmentName) {
        const nameExists = await Department.findOne({ departmentName });
        if (nameExists) {
            res.status(400);
            throw new Error('Department name already exists');
        }
    }

    departmentExist.departmentName = departmentName ||  departmentExist.departmentName;
    departmentExist.description = description || departmentExist.description;
    const updatedDepartment = await departmentExist.save();
    res.status(200).json(updatedDepartment)
})

const deleteDepartment = AsyncHandler(async (req,res)=>{
    const department = await Department.findById(req.params.id);
    if(!department){
        res.status(404)
        throw new Error('no departmet exists!');
    }
    await department.deleteOne();
    res.status(200).json({ message: 'Department deleted successfully' });
})

module.exports = {
    createDepartment,getDepartment,getSingleDepartment,updateDepartment,deleteDepartment
}