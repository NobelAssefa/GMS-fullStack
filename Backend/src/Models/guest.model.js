const mongoose = require('mongoose')
const guestSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    is_vip: {
        type: Boolean,
    },
    has_car:{
        type:Boolean,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

},{
    timestamps:true
});

module.exports = mongoose.model("Guest", guestSchema)