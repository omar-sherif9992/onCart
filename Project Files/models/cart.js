require('dotenv').config();
const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({ // schema

    userID: {
        type: String,
        required: [true]
    }, 
    itemID: {
        type: String,
        required: [true]
    },
    quantity: Number
}, { timestamps: true });


const Cart = new mongoose.model("Cart", cartSchema); 

module.exports = Cart;