const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
    item_name:{
        type:String,
        required:true
    },
    visit_id:{
        type:mongoose.Schema.Types.ObjectId,ref:"Visit"
    },
    quantity:{
        type:Number,
        required:true
    },
    description:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
});

module.exports = mongoose.model("Item", itemSchema);

