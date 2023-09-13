const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const encoder = bodyParser.urlencoded();

const app = express();

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "apen_race"
});

// connect to the database
connection.connect(function(error){
    if (error) throw error
    else console.log("connected to the database successfully!")
});

app.post("/", encoder, function(req, res){
    var username = req.body.username;
    var password = req.body.password;

    connection.query("select * from account where user_name = ? and user_pass = ?",[username,password],function(eror, results,fields){
        if(results,length > 0) {
            res.redirect("/home.html");
        } else {
            res.redirect("/");
        }
        res.end();
    });
});

//when login is success
app.get("/home.html",function(req,res){
    res.sendFile(__dirname + "/home.html");
});