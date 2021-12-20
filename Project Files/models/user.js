require('dotenv').config();
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const userSchema = new mongoose.Schema({ // schema
    username: {
        type: String,
        required: [true, "Please enter your username"],
        lowercase: true,
        index: { unique: true }
    }, // always convert userName to lowercase
    password: {
        type: String,
        minLength: 8,
        maxLength: 12,
        required: [true, "Please enter your Password"]
    }
}, { timestamps: true });

const secret = process.env.SECRET;

//password encryption
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });
const User = new mongoose.model("User", userSchema); // name of the table (class like oop) although we will get a collection that will be called in plural

module.exports = User;