require('dotenv').config();
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({ // schema

    username: {
        type: String,
        required: [true, "Please enter your username"],
        lowercase: true,
    }, // always convert userName to lowercase
    password: {
        type: String,
        minLength: 8,
        required: [true, "Please enter your Password"]


    }
}, { timestamps: true });


const User = new mongoose.model("User", userSchema); // name of the table (class like oop) although we will get a collection that will be called in plural

module.exports = User;