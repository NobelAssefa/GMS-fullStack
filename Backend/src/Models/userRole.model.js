const mongoose = require("mongoose")

const roleSchema = mongoose.Schema({
    roleName:{
        type:String,
        required:true,
        unique:true,
        enum: ['ADMIN', 'DIRECTOR', 'SECRATORY', 'VP',"PRESIDENT"],
    }

},{
    timestamps:true
});

module.exports = mongoose.model("Role", roleSchema);
