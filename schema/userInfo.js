const mongoose = require('mongoose');
const Schema = mongoose.Schema;  // Add this line

const userSchema = new Schema({  // Changed to use Schema directly
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true
    },
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true
    },
    profilePhoto: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
});

// Add methods
userSchema.methods.updateLastLogin = function() {
    this.lastLogin = new Date();
    return this.save();
};

userSchema.statics.findByGoogleId = function(googleId) {
    return this.findOne({ googleId });
};

// Export the model correctly
module.exports = mongoose.model('googleUser', userSchema);