require('dotenv').config();
const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({ // schema

    name: {
        type: String,
        required: [true, "Please enter your username"],
        lowercase: true,
    }, // always convert userName to lowercase
    img: {
        type: String,
        //minLength: 8,
        required: [true, "Please enter your Password"]
    },
    price: Number
}, { timestamps: true });


const Item = new mongoose.model("Item", itemSchema); // name of the table (class like oop) although we will get a collection that will be called in plural

module.exports = Item;