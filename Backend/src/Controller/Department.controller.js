const AsyncHandler = require('express-async-handler');
const Department = require('../Models/Department.model');


const createDepartment = AsyncHandler(async (req,res)=>{
    const {departmentName}= req.body;
    const departmentExist = await Department.findOne({departmentName})
    if(departmentExist){
        res.status(400);
        throw new Error('department already registerd')
    }

    const department = await Department.create({departmentName});
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
    const {departmentName} = req.body;
    const departmentExist = await Department.findById(req.params.id)
    if(!departmentExist){
        res.status(404)
        throw new Error('No department found!')
    }
    departmentExist.departmentName = departmentName ||  departmentExist.departmentName;
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