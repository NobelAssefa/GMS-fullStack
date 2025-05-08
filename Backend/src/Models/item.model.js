const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guest',
        required: true
    },
    description: {
        type: String
    },
    isChecked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Item", itemSchema);

