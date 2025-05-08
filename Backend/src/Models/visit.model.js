const mongoose = require('mongoose')

const visitSchema = mongoose.Schema({
    guest_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Guest', required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    department_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true
    },
    car: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Car'
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Item'
    }],
    visit_date: { type: Date, default: Date.now },
    duration: String,
    unique_code: String,
    is_approved: { type: Boolean, default: false },
    checked_in: { type: Boolean, default: false },
    checked_out: { type: Boolean, default: false },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Visit', visitSchema);


