const mongoose = require('mongoose')

const carSchema = mongoose.Schema({
    guest:{
        type:mongoose.Schema.Types.ObjectId,ref:"Guest"
    },
    plate_number:{
        type:String,    
    },
    color:{
        type:String,
    },
    model:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
});

module.exports = mongoose.model("Car", carSchema);
