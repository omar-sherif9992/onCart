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

app.listen(port, () =>{
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
var client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); //inside request
//Mongo Atlas Conncetion
async function makeUSERCOLLECTION() {
    await client.connect();
    await client.db('myDB').createCollection("User");
    await client.close();
}

async function makeITEMCOLLECTION() {
    await client.connect();
    await client.db('myDB').createCollection("Item");
    await client.close();
}


async function main() {
    var { MongoClient } = require('mongodb');
    var client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    var user = { name: "Hussein", password: "hello" };
    var user2 = { name: "Husein", password: "hello" };
    // await makeUSERCOLLECTION();
    // await makeCARTCOLLECTION();
    // await makeITEMCOLLECTION();
    //await addItems();
    var x = await client.db('myDB').collection('collection1').find().toArray();
    for (var i = 0; i < x.length; i++) {
        if (x[i].name == user2.name && x[i].password == user2.password) {
            console.log("Found");
        }
        else {
            console.log("A7a");
        }

    }
    await client.close();
}
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
    /*app.post('/search',function(req,res)
    {
       var x = req.body.Search;
       
    });*/

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

app.get('/cart', function (req, res) {
    res.render('cart');
});


async function search(tmp) {
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

async function addToCart(uid,iid,count) {
    await client.connect();
    await client.db('myDB').collection('Cart').insertOne(new Cart({ userID: uid, itemID: iid, quantity: count }));
    await client.close();
}    

app.post("/boxing",async function (req, res) {
    const itemName = "Boxing Bag";
    handleAddToCartButton(itemName);
    res.redirect("/boxing");
});

app.post("/galaxy", function (req, res) {
    const itemName = "Galaxy S21 Ultra";
    handleAddToCartButton(itemName);
    res.redirect("/galaxy");
});

app.post("/iphone", function (req, res) {
    const itemName = "iPhone 13 Pro";
    handleAddToCartButton(itemName);
    res.redirect("/iphone");
});

app.post("/leaves", function (req, res) {
    const itemName = "Leaves Of Grass";
    handleAddToCartButton(itemName);
    res.redirect("/leaves");
});

app.post("/sun", function (req, res) {
    const itemName = "The Sun and Her Flowers";
    handleAddToCartButton(itemName);
    res.redirect("/sun");
});

app.post("/tennis", function (req, res) {
    const itemName = "Tennis Racket";
    handleAddToCartButton(itemName);
    res.redirect("/tennis");
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

async function InsertUser(username, pass) {
    await client.connect();
    var x = new User({ username: username, password: pass, cart: [] });
    currentUser = x;
    await client.db('myDB').collection('User').insertOne(x);
    await client.close();
}
async function FindUser(username, password) {
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

async function handleAddToCartButton(itemName){
    await client.connect();
    let items = await client.db('myDB').collection('Item').find().toArray();
    let carts = await client.db('myDB').collection('Cart').find().toArray();
    await client.close();
    let itemData;
    for(let i = 0;i < items.length;i++){
        if(items[i].name === itemName){
            itemData = items[i];
            break;
        }
    }
    let user = currentUser._id;
    let item = itemData._id;
    let count = 1;
    let flag = false;
    for(let j = 0;j < carts.length;j++){
        if(carts[j].userID === user && carts[j].itemID === item){
            db.Cart.update({userID: user, itemID: item},{$set : {quantity : (carts[j].quantity + 1)}});
            flag = true;
        }
    }
    if(!flag){
        addToCart(user,item,count);
    }
}
