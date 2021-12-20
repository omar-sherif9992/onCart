//jshint esversion:6
//Modules
require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser'); //for accessing the request body
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const User = require("./models/user.js");
const app = express();
const port = 3000; //note :form action should be written in it the route
const encrypt = require('mongoose-encryption');


const encryptpwd = require('encrypt-with-password');

const text = 'Hello, World!';
const password = 'examplepassword';

const encrypted = encryptpwd.encrypt(text, password); // ---> this is the encrypted (output) value

// example encrypted value: 'e68e7ccd9e908665818a49f111c342ed:c9b83ff7624bb3b26af8cc853d61cd2f7959cecc4308383c39a0924e90637889'

const decrypted = encryptpwd.decrypt(encrypted, password) // ---> this decrypts the encrypted value and yields the original text

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); // to be able to parsing into post request
app.set('view engine', 'ejs'); //for templating and layout

//Mooongose Setup
const dbName = "usersDB" //database name
mongoose.connect('mongodb://localhost:27017/' + dbName, { useNewUrlParser: true })
    .then(app.listen(port, function() {
        console.log(`Example app listening at http://localhost:${port}`);
    })).catch((err) => { console.log("The database failed to load" + err) }); //to connect to a url







// omar sherif ali

app.get('/', function(req, res) {
    res.setHeader('Content-type', 'text/html'); //to indicate what the content you write 

    res.render('home');
});



app.get('/login', function(req, res) {
    res.setHeader('Content-type', 'text/html'); //to indicate what the content you write 
    res.render('login', { link: "/registration" });

});
app.post('/login', function(req, res) {
    res.setHeader('Content-type', 'text/html'); //to indicate what the content you write 
    let username = (String(req.body.username)).toLowerCase();
    let password = (String(req.body.password)).toLowerCase();

    User.findOne({ username: username }, function(err, foundUser) {

        if (err) {

            console.log(err);
        } else if (foundUser) {
            if (foundUser.password === password) {
                res.redirect('/');
            }

            res.redirect('/login');
        } else {
            res.redirect('/login');

        }
    });
    res.redirect('/')
});

app.get('/registration', function(req, res) {
    res.setHeader('Content-type', 'text/html'); //to indicate what the content you write 
    res.render('registration');

});


app.post('/registration', function(req, res) {
    res.setHeader('Content-type', 'text/html'); //to indicate what the content you write 
    let username = (String(req.body.username)).toLowerCase();
    let password = (String(req.body.password)).toLowerCase();
    let user = new User({
        username: username,
        password: password
    });


    user.save()
        .then(() => {
            console.log("Successfully added ! \r\n\r\n" + person);
            res.redirect('/');
        })
        .catch((err) => { console.log(err + "omar") }); //save the object in the database and then prints a confirmation statement


    res.redirect("/");
});



// hussein




//omar meteiny



// zyad



// seif



//404 page
app.use((req, res) => {
    res.status(404).render('error');
});