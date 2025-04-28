const Role = require("../Models/userRole.model")
const AsyncHandler = require('express-async-handler')


const createRole = AsyncHandler( async(req,res)=>{

    const {roleName} = req.body
    const roleExist = await Role.findOne({roleName})
    if(roleExist){
        res.status(400)
        throw new Error('role already exists')
    }

    const role = await Role.create({roleName})
    res.status(201).json(role)

});

const getRoles = AsyncHandler( async (req,res)=>{
    const Roles = await Role.find()
    res.status(200).json(Roles)

})

const UpdateRole = AsyncHandler(async(req,res)=>{
    const {roleName} = req.body
    const role = await Role.findById(req.params.id)

    if(!role){
        res.status(404)
        throw new Error('no role found ')
    }

    role.roleName = roleName || role.roleName
    const updatedRole = await role.save()
    res.status(200).json(updatedRole)
})

const deleteRole = AsyncHandler(async (req, res) => {
    const role = await Role.findById(req.params.id);
  
    if (!role) {
      res.status(404);
      throw new Error('Role not found');
    }
  
    await role.deleteOne();
    res.status(200).json({ message: 'Role deleted successfully' });
  });



  
module.exports = {
    getRoles,
    createRole,
    UpdateRole,
    deleteRole,
  };