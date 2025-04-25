const mongoose = require('mongoose')

const visitSchema = mongoose.Schema({
    guest:{
        type:mongoose.Schema.Types.ObjectId,ref:"Guest"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,ref:"User"
    },
    department:{
        type:mongoose.Schema.Types.ObjectId,ref:"Department"
    },
    visit_date:Date,
    createdAt:{
        type:Date,
        default:Date.now
    },
    duration:String,
    unique_code:String,
    is_approved:{type:Boolean,default:false},
    checked_in:{type:Boolean,default:false},
    checked_out:{type:Boolean,default:false},
    
},{
    timestamps:true
});

module.exports = mongoose.model("Visit", visitSchema);


