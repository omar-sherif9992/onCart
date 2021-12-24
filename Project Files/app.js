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

app.listen(port, () => {
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
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); //inside request
//Mongo Atlas Conncetion




//main();

var currentUser;

// omar sherif ali
app.get('/home', function (req, res) {
    res.render('home');
});


//login
app.get('/', function (req, res) {
    res.render('login', { errors: [] });
});
//login
app.post('/', async function (req, res) {
    let username = (String(req.body.username)).toLowerCase();
    let password = ((String(req.body.password)).toLowerCase());
    var c = await FindUser(username, password);
    if (c === true) {
        res.redirect('/home');
    }
    else {
        res.render('login', { errors: ["Invalid Information"] });
    }
});

app.get('/registration', function (req, res) {
    res.render('registration', { errors: [] });

});

app.post('/registration', async function (req, res) {
    let username = (String(req.body.username)).toLowerCase();
    let password = (String(req.body.password)).toLowerCase();
    console.log(username);
    console.log(password);
    if (await FindUser(username, null) == true) {
        res.render('registration', { errors: ["Username is already taken"] });
    }
    else {
        InsertUser(username, password);
        res.redirect('/home');
    }
});

//Hussein
app.post('/home', function (req, res) {
    res.redirect("/cart");
});

app.post('/search', async function (req, res) {
    var x = req.body.Search;
    var arr = await search(x);
    res.render('searchresults', { foo: arr, str: "" });
});

app.get('/phones', function (req, res) {
    res.render('phones');
});

app.get('/books', function (req, res) {
    res.render('books');
});

app.get('/sports', function (req, res) {
    res.render('sports');
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

async function handleAddToCartButton(itemName) {
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
        let user = currentUser._id.toString();
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
            addToCart(user, item, count);
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
    if (!getCurrentUser()) {
        res.redirect('/');
        return;
    }
    handleAddToCartButton(itemName);
    res.redirect("/boxing");
});

app.post("/galaxy", function (req, res) {
    const itemName = "Galaxy S21 Ultra";
    if (!getCurrentUser()) {
        res.redirect('/');
        return;
    }
    handleAddToCartButton(itemName);
    res.redirect("/galaxy");
});

app.post("/iphone", function (req, res) {
    const itemName = "iPhone 13 Pro";
    if (!getCurrentUser()) {
        res.redirect('/');
        return;
    }
    handleAddToCartButton(itemName);
    res.redirect("/iphone");
});

app.post("/leaves", function (req, res) {
    const itemName = "Leaves Of Grass";
    if (!getCurrentUser()) {
        res.redirect('/');
        return;
    }
    handleAddToCartButton(itemName);
    res.redirect("/leaves");
});

app.post("/sun", function (req, res) {
    const itemName = "The Sun and Her Flowers";
    if (!getCurrentUser()) {
        res.redirect('/');
        return;
    }
    handleAddToCartButton(itemName);
    res.redirect("/sun");
});

app.post("/tennis", function (req, res) {
    const itemName = "Tennis Racket";
    if (!getCurrentUser()) {
        res.redirect('/');
        return;
    }
    handleAddToCartButton(itemName);
    res.redirect("/tennis");
});




app.get('/cart',async function (req, res) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    if (!getCurrentUser()) {
        res.redirect('/');
        return;
    }
    let userCart = await client.db('myDB').collection('Cart').find({userID : currentUser._id.toString()}).toArray();
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
    res.render('cart',{array : arr, totalAmount : totAmount, totalPrice : totPrice});
});

async function deleteFromCart(itemName){
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
    let user = currentUser._id.toString();
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
async function addCart(itemName){
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
    let user = currentUser._id.toString();
    let item = itemData._id.toString();
    for (let j = 0; j < carts.length; j++) {
        if (carts[j].userID === user && carts[j].itemID === item) {
            await client.db("myDB").collection("Cart").updateOne({ userID: user, itemID: item }, { $set: { quantity: (carts[j].quantity + 1) } });
        }
    }
    client.close();
}
app.post('/cart', async function(req,res){
    const action = req.body.action;
    const itemName = action.substring(0,action.length-2);
    const verb = action.substring(action.length-1);
    if (verb === "R") {
        deleteFromCart(itemName);
        res.redirect('/cart');
    }
    else{
        addCart(itemName);
        res.redirect('/cart');
    }
});





//Seif
app.post('/books', function (req, res) {
    if (document.getElementById("sun").clicked == true) {
        res.redirect('/sun');
    }
    if (document.getElementById("leaves").clicked == true) {
        res.redirect('/leaves');
    }
});



app.post('/phones', function (req, res) {
    if (document.getElementById("iphone").clicked == true) {
        res.redirect('/iphone');
    }
    if (document.getElementById("galaxy").clicked == true) {
        res.redirect('/galaxy');
    }
});

app.post('/sports', function (req, res) {
    if (document.getElementById("boxing").clicked == true) {
        res.redirect('/boxing');
    }
    if (document.getElementById("tennis").clicked == true) {
        res.redirect('/tennis');
    }
});






app.get('/sun', function (req, res) {
    res.render('sun');
});

app.get('/leaves', function (req, res) {
    res.render('leaves');
});
app.get('/boxing', function (req, res) {
    if (!getCurrentUser()) {
        res.redirect('/');
        return;
    }
    res.render('boxing');
});
app.get('/tennis', function (req, res) {
    res.render('tennis');
});
app.get('/iphone', function (req, res) {
    res.render('iphone');
});
app.get('/galaxy', function (req, res) {
    res.render('galaxy');
});



//404 page
app.use((req, res) => {
    res.status(404).render('error');
});

function getCurrentUser() {
    return currentUser;
}

async function InsertUser(username, pass) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    var x = new User({ username: username, password: pass, cart: [] });
    currentUser = x;
    await client.db('myDB').collection('User').insertOne(x);
    await client.close();
}
async function FindUser(username, password) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    var x = await client.db('myDB').collection('User').find().toArray();
    await client.close();
    for (var i = 0; i < x.length; i++) {
        if (x[i].username === username) {
            if (password == null) {
                return true;
            }
            else {
                if (x[i].password == password) {
                    currentUser = x[i];
                    return true;
                }
                else return false;
            }
        }
    }
    return false;
}

