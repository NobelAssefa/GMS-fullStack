const mongoose = require('mongoose')

const visitApprovalSchema = mongoose.Schema({
    visit:{
        type:mongoose.Schema.Types.ObjectId,ref:"Visit"
    },
    approved_by:{
        type:mongoose.Schema.Types.ObjectId,ref:"User"
        
    },
    status:{
        type:String,
        enum:["approved","rejected","pending"],
        default:"pending"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    comment:{
        type:String,
    },
    action_date:{
        type:Date,
        default:Date.now
    }

        
},{
    timestamps:true
});

module.exports = mongoose.model("VisitApproval", visitApprovalSchema);

