const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true,
        unique : true
    }
}, {timestamps : true});

module.exports = new mongoose.model('userInfo', userSchema);
