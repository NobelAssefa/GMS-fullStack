const mongoose = require('mongoose')
const guestSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required:[true, "Please provide your email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid emaial",
          ],
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