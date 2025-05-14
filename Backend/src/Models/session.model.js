const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    deviceInfo: {
        type: String,
        default: 'Unknown Device'
    },
    lastActivity: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 24 * 60 * 60 // Automatically delete documents after 24 hours
    }
});

// Index for faster queries
sessionSchema.index({ userId: 1, token: 1 });

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session; 