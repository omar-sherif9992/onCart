require('dotenv').config();
const { MongoClient } = require('mongodb');
const User = require('./models/user');
const Item = require('./models/item');
const Cart = require('./models/cart');
const uri = process.env.ATLAS_URI;
//Mongo Atlas Conncetion
async function makeUserCollection() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); //inside request
    await client.connect();
    try {
        await client.db('myDB').dropCollection("User");
    }
    catch {

    }
    await client.db('myDB').createCollection("User");
    await client.close();
}

async function makeItemCollection() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); //inside request
    await client.connect();
    try {
        await client.db('myDB').dropCollection("Item");
    }
    catch {

    }
    await client.db('myDB').createCollection("Item");
    await client.close();
}

async function makeCartCollection() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); //inside request
    await client.connect();
    try {
        await client.db('myDB').dropCollection("Cart");
    }
    catch {

    }
    await client.db('myDB').createCollection("Cart");
    await client.close();
}

//Inserting the ITEMS into the DATABASE
async function addItems() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); //inside request
    await client.connect();
    await client.db('myDB').collection('Item').insertOne(new Item({ name: "Boxing Bag", img: "boxing.jpg", price: 500 }));
    await client.db('myDB').collection('Item').insertOne(new Item({ name: "Tennis Racket", img: "tennis.jpg", price: 925 }));
    await client.db('myDB').collection('Item').insertOne(new Item({ name: "Leaves of Grass", img: "leaves.jpg", price: 300 }));
    await client.db('myDB').collection('Item').insertOne(new Item({ name: "The Sun and Her Flowers", img: "sun.jpg", price: 225 }));
    await client.db('myDB').collection('Item').insertOne(new Item({ name: "Galaxy S21 Ultra", img: "galaxy.jpg", price: 20500 }));
    await client.db('myDB').collection('Item').insertOne(new Item({ name: "iPhone 13 Pro", img: "iphone.jpg", price: 24225 }));
    await client.close();
}

async function main() {
    await makeUserCollection();
    await makeCartCollection();
    await makeItemCollection();
    await addItems();
}
// main();

exports.main = main;