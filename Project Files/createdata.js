const { MongoClient } = require('mongodb');
const User = require('./models/user');
const Item = require('./models/item');
const Cart = require('./models/cart');
const uri = process.env.ATLAS_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); //inside request
//Mongo Atlas Conncetion
async function makeUserCollection() {
    await client.db('myDB').createCollection("User");
}

async function makeItemCollection() {
    await client.db('myDB').createCollection("Item");
}

async function makeCartCollection() {
    await client.db('myDB').createCollection("Cart");
}

//Inserting the ITEMS into the DATABASE
async function addItems() {
    await client.db('myDB').collection('Item').insertOne(new Item({ name: "Boxing Bag", img: "boxing.jpg", price: 500 }));
    await client.db('myDB').collection('Item').insertOne(new Item({ name: "Tennis Racket", img: "tennis.jpg", price: 925 }));
    await client.db('myDB').collection('Item').insertOne(new Item({ name: "Leaves of Grass", img: "leaves.jpg", price: 300 }));
    await client.db('myDB').collection('Item').insertOne(new Item({ name: "The Sun and Her Flowers", img: "sun.jpg", price: 225 }));
    await client.db('myDB').collection('Item').insertOne(new Item({ name: "Galaxy S21 Ultra", img: "galaxy.jpg", price: 20500 }));
    await client.db('myDB').collection('Item').insertOne(new Item({ name: "iPhone 13 Pro", img: "iphone.jpg", price: 24225 }));
}

async function main() {
    var { MongoClient } = require('mongodb');
    await client.connect();
    await makeUserCollection();
    await makeCartCollection();
    await makeItemCollection();
    await addItems();
    await client.close();
}
main();