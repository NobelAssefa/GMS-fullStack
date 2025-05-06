const mongoose = require('mongoose')

const departmentSchema = mongoose.Schema({
    departmentName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Department", departmentSchema);