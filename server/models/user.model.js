const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'User fullname is required']
    },
    email: {
        type: String,
        required: [true, 'User email is required'],
        validate: [validator.isEmail, 'Email should be valid']
    },
    password: {
        type: String,
        required: [true, 'User password is required'],
        minLength: [6, 'Password must be at least 6 characters'],
        select: false
    }
}, { timestamps: true });

userSchema.pre('save', async function(){
    if(!this.isModified('password')){
        return;
    };

    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePasswords = async (candidate, password) => {
    return await bcrypt.compare(candidate, password);
};

userSchema.methods.signToken = function(){
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
};

const User = mongoose.model('user', userSchema);

module.exports = User;