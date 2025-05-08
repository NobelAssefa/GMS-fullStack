const mongoose = require('mongoose')

const carSchema = mongoose.Schema({
    plateNumber: {
        type: String,
        required: true,
        unique: true
    },
    carModel: {
        type: String,
        required: true
    },
    carColor: {
        type: String,
        required: true
    },
    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guest',
        required: true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
});

module.exports = mongoose.model("Car", carSchema);
