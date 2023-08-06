const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [2,'First name should be minimum of 2 characters']
    },
    lastName: {
        type: String,
        required: true,
        minLength:[2,'Last name should be minimum of 2 characters']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Invalid email address']
    },
    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        required: true,
        enum: ['admin', 'employer', 'user']
    },

});

module.exports = mongoose.model('User', userSchema);