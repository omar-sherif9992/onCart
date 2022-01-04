//jshint esversion:6
//Modules
require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser'); //for accessing the request body
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const app = express();
const port = 3020; //note :form action should be written in it the route
const md5 = require('md5');
const session = require('express-session');
const { main } = require('./createdata.js');

// main();

app.listen(process.env.PORT || port, () => {
    console.log(`Website is running at url http://localhost:${port}`);
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); // to be able to parsing into post request
app.set('view engine', 'ejs'); //for templating and layout

//session
app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

var { MongoClient } = require('mongodb');
const e = require('express');
const User = require('./models/user');
const Item = require('./models/item');
const Cart = require('./models/cart');
const uri = process.env.ATLAS_URI;

//Mongo Atlas Conncetion


// omar sherif ali
app.get('/home', async function (req, res) {
    if (!getCurrentUser(req)) {
        res.redirect('/');
    }
    const cartData = await getCart(req);
    res.render('home',cartData);
});


//login
app.get('/', function (req, res) {
    res.render('login', { errors: [] });
});
//login
app.post('/', async function (req, res) {
    let username = (String(req.body.username)).toLowerCase();
    let password = ((String(req.body.password)).toLowerCase());
    var c = await FindUser(username, password, req);
    if (c === true) {
        res.redirect('/home');
    }
    else {
        res.render('login', { errors: ["Invalid Information"] });
    }
});

app.post('/logout', async function(req,res){
    setCurrentUser(req,null);
    res.redirect('/');
});

app.get('/registration', function (req, res) {
    res.render('registration', { errors: [] });
});

app.post('/registration', async function (req, res) {
    let username = (String(req.body.username)).toLowerCase();
    let password = (String(req.body.password)).toLowerCase();
    if (await FindUser(username, null, req) == true) {
        res.render('registration', { errors: ["Username is already taken"] });
    }
    else {
        await InsertUser(username, password, req);
        res.redirect('/home');
    }
});

//Hussein
app.post('/home', function (req, res) {
    if (!getCurrentUser(req)) {
        res.redirect('/');
    }
    res.redirect("/cart");
});

app.post('/search', async function (req, res) {
    if (!getCurrentUser(req)) {
        res.redirect('/');
    }
    var x = req.body.Search;
    var arr = await search(x);
    const cartData = await getCart(req);
    res.render('searchresults', { foo: arr, str: "" ,totalAmount:cartData.totalAmount});
});

app.get('/phones', async function (req, res) {
    if (!getCurrentUser(req)) {
        res.redirect('/');
    }
    const cartData = await getCart(req);
    res.render('phones',cartData);
});

app.get('/books', async function (req, res) {
    if (!getCurrentUser(req)) {
        res.redirect('/');
    }
    const cartData = await getCart(req);
    res.render('books',cartData);
});

app.get('/sports', async function (req, res) {
    if (!getCurrentUser(req)) {
        res.redirect('/');
    }
    const cartData = await getCart(req);
    res.render('sports',cartData);
});

async function search(tmp) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    var arr = [];
    var items = await client.db('myDB').collection('Item').find().toArray();
    await client.close();
    for (var i = 0; i < items.length; ++i) {
        var str = items[i].name;
        if (str.toLowerCase().includes(tmp.toLowerCase()) == true) {
            arr.push(items[i]);
        }
    }
    return arr;
}

/*app.get('/searchresults',function(req,res)
{
    res.render('searchresults',arr);

});*/

//Omar El Meteiny
//Ziad

async function addToCart(uid, iid, count) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    await client.db('myDB').collection('Cart').insertOne(new Cart({ userID: uid, itemID: iid, quantity: count }));
    await client.close();
}

async function handleAddToCartButton(itemName, req) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); //inside request
    await client.connect();
    try {
        let items = await client.db('myDB').collection('Item').find().toArray();
        let carts = await client.db('myDB').collection('Cart').find().toArray();
        let itemData;
        for (let i = 0; i < items.length; i++) {
            if (items[i].name === itemName) {
                itemData = items[i];
                break;
            }
        }
        let user = getCurrentUser(req)._id.toString();
        let item = itemData._id.toString();
        let count = 1;
        let flag = false;
        for (let j = 0; j < carts.length; j++) {
            if (carts[j].userID === user && carts[j].itemID === item) {
                await client.db("myDB").collection("Cart").updateOne({ userID: user, itemID: item }, { $set: { quantity: (carts[j].quantity + 1) } });
                flag = true;
            }

        }
        if (!flag) {
            await addToCart(user, item, count);
        }
    } finally {
        await client.close();
    }
}


function containsItemID(id,userCart){
    for(let i = 0;i < userCart.length;i++){
        if(userCart[i].itemID === id){
            return userCart[i].quantity;
        }
    }
    return 0;
}

function ItemWithQuantity(item,quan){
    this.item = item;
    this.quan = quan;
}

app.post("/boxing", async function (req, res) {
    const itemName = "Boxing Bag";
    if (!getCurrentUser(req)) {
        res.redirect('/');
        return;
    }
    await handleAddToCartButton(itemName, req);
    res.redirect("/boxing");
});

app.post("/galaxy", async function (req, res) {
    const itemName = "Galaxy S21 Ultra";
    if (!getCurrentUser(req)) {
        res.redirect('/');
        return;
    }
    await handleAddToCartButton(itemName, req);
    res.redirect("/galaxy");
});

app.post("/iphone", async function (req, res) {
    const itemName = "iPhone 13 Pro";
    if (!getCurrentUser(req)) {
        res.redirect('/');
        return;
    }
    await handleAddToCartButton(itemName, req);
    res.redirect("/iphone");
});

app.post("/leaves", async function (req, res) {
    const itemName = "Leaves of Grass";
    if (!getCurrentUser(req)) {
        res.redirect('/');
        return;
    }
    await handleAddToCartButton(itemName, req);
    res.redirect("/leaves");
});

app.post("/sun", async function (req, res) {
    const itemName = "The Sun and Her Flowers";
    if (!getCurrentUser(req)) {
        res.redirect('/');
        return;
    }
    await handleAddToCartButton(itemName, req);
    res.redirect("/sun");
});

app.post("/tennis", async function (req, res) {
    const itemName = "Tennis Racket";
    if (!getCurrentUser(req)) {
        res.redirect('/');
        return;
    }
    await handleAddToCartButton(itemName, req);
    res.redirect("/tennis");
});



async function getCart(req){
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    let userCart = await client.db('myDB').collection('Cart').find({userID : getCurrentUser(req)._id.toString()}).toArray();
    let items = await client.db('myDB').collection('Item').find().toArray();
    let arr = [];
    let totAmount = 0;
    let totPrice = 0;
    for(let i = 0;i < items.length;i++){
        let q = containsItemID(items[i]._id.toString(),userCart);
        if(q != 0){
            let itemData = new ItemWithQuantity(items[i],q);
            arr.push(itemData);
            totAmount = totAmount + q;
            totPrice = totPrice + items[i].price * q;
        }
    }
    return {array : arr, totalAmount : totAmount, totalPrice : totPrice};
}

app.get('/cart',async function (req, res) {
    if (!getCurrentUser(req)) {
        res.redirect('/');
        return;
    }
    const cartData = await getCart(req);
    res.render('cart',cartData);
});

async function deleteFromCart(itemName, req){
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); //inside request
    await client.connect();
    let items = await client.db('myDB').collection('Item').find().toArray();
    let carts = await client.db('myDB').collection('Cart').find().toArray();
    let itemData;
    for (let i = 0; i < items.length; i++) {
        if (items[i].name === itemName) {
            itemData = items[i];
            break;
        }
    }
    let user = getCurrentUser(req)._id.toString();
    let item = itemData._id.toString();
    for (let j = 0; j < carts.length; j++) {
        if (carts[j].userID === user && carts[j].itemID === item) {
            if(carts[j].quantity > 1){
                await client.db("myDB").collection("Cart").updateOne({ userID: user, itemID: item }, { $set: { quantity: (carts[j].quantity - 1) } });
            }
            else{
                await client.db("myDB").collection("Cart").deleteOne({userID: user, itemID: item});
            }
        }
    }
    client.close();
}
async function addCart(itemName, req){
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); //inside request
    await client.connect();
    let items = await client.db('myDB').collection('Item').find().toArray();
    let carts = await client.db('myDB').collection('Cart').find().toArray();
    let itemData;
    for (let i = 0; i < items.length; i++) {
        if (items[i].name === itemName) {
            itemData = items[i];
            break;
        }
    }
    let user = getCurrentUser(req)._id.toString();
    let item = itemData._id.toString();
    for (let j = 0; j < carts.length; j++) {
        if (carts[j].userID === user && carts[j].itemID === item) {
            await client.db("myDB").collection("Cart").updateOne({ userID: user, itemID: item }, { $set: { quantity: (carts[j].quantity + 1) } });
        }
    }
    client.close();
}
app.post('/cart', async function(req,res){
    if (!getCurrentUser(req)) {
        res.redirect('/');
    }
    const action = req.body.action;
    const itemName = action.substring(0,action.length-2);
    const verb = action.substring(action.length-1);
    if (verb === "R") {
        await deleteFromCart(itemName, req);
        res.redirect('/cart');
    }
    else{
        await addCart(itemName, req);
        res.redirect('/cart');
    }
});

app.get('/sun', async function (req, res) {
    if (!getCurrentUser(req)) {
        res.redirect('/');
        return;
    }
    const cartData = await getCart(req);
    res.render('sun',cartData);
});

app.get('/leaves', async function (req, res) {
    if (!getCurrentUser(req)) {
        res.redirect('/');
        return;
    }
    const cartData = await getCart(req);
    res.render('leaves',cartData);
});
app.get('/boxing', async function (req, res) {
    if (!getCurrentUser(req)) {
        res.redirect('/');
        return;
    }
    const cartData = await getCart(req);
    res.render('boxing',cartData);
});

app.get('/tennis', async function (req, res) {
    if (!getCurrentUser(req)) {
        res.redirect('/');
        return;
    }
    const cartData = await getCart(req);
    res.render('tennis',cartData);
});
app.get('/iphone', async function (req, res) {
    if (!getCurrentUser(req)) {
        res.redirect('/');
        return;
    }
    const cartData = await getCart(req);
    res.render('iphone',cartData);
});
app.get('/galaxy', async function (req, res) {
    if (!getCurrentUser(req)) {
        res.redirect('/');
        return;
    }
    const cartData = await getCart(req);
    res.render('galaxy',cartData);
});



//404 page
app.use((req, res) => {
    res.status(404).render('error');
});

function getCurrentUser(req) {
    return req.session.user;    
}

function setCurrentUser(req, user) {
    req.session.user = user;
}

async function InsertUser(username, pass, req) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const user = new User({ username: username, password: pass });
    setCurrentUser(req, user);
    await client.db('myDB').collection('User').insertOne(user);
    await client.close();
}
async function FindUser(username, password, req) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const users = await client.db('myDB').collection('User').find().toArray();
    await client.close();
    for (var i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            if (password == null) {
                return true;
            }
            else {
                if (users[i].password == password) {
                    setCurrentUser(req, users[i]);
                    return true;
                }
                else return false;
            }
        }
    }
    return false;
}

