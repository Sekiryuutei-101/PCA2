const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({  // Changed to use Schema directly
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
    

});

module.exports = mongoose.model('userInfo', userSchema);