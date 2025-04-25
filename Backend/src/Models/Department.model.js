const mongoose = require('mongoose')

const departmentSchema = mongoose.Schema({
    department_name:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

module.exports = mongoose.model("Department", departmentSchema);