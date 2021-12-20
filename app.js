//jshint esversion:6
//Modules
const express = require("express");
const bodyParser = require('body-parser'); //for accessing the request body
const request = require('request');
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
const port = 3000; //note :form action should be written in it the route


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); // to be able to parsing into post request
app.set('view engine', 'ejs'); //for templating and layout

//Mooongose Setup
const dbName = "usersDB" //database name
mongoose.connect('mongodb://localhost:27017/' + dbName, { useNewUrlParser: true }); //to connect to a url
const Schema = new mongoose.Schema({ // schema
    userName: { type: String, defaultValue: "Mr. Unknown", required: [true, "Please enter your username"], lowercase: true }, // always convert userName to lowercase
    password: { type: String, minLength: 8, maxLength: 12, required: [true, "Please enter your username"] },

});

const User = new mongoose.model("User", Schema); // name of the table (class like oop) although we will get a collection that will be called in plural
const user = new User({ name: "omar", age: 20 }); // object




user.save().then(() => { console.log("Successfully added ! \r\n\r\n" + person) }); //save the object in the database and then prints a confirmation statement



app.get('/', function(req, res) {
    res.setHeader('Content-type', 'text/html'); //to indicate what the content you write 

});

//404 page
app.use((req, res) => {

    res.status(404).render('404');

})
app.listen(port, function() {
    console.log(`Example app listening at http://localhost:${port}`);
});