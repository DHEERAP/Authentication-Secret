//jshint esversion:6\
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
const encrypt = require("mongoose-encryption");
//const _= require("lodash");

//console.log(process.env.API_KEY);


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// 127.0.0.1
 const uri = 'mongodb://127.0.0.1:27017';
const databaseName = "userDB";

async function connect() {
  try {
    // Connect to the MongoDB server
    await mongoose.connect(uri + '/' + databaseName, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB server is started");

    const userSchema = new mongoose.Schema ({  //  now it is not a simple js objec but a object who created by a mongoose schema class

        email: String,
        password: String
    });


   
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]  }); // encrypt password // add encrypt package to the schema before as a plugin
//add this plugin to the mongoose schema before you create your  mongoose model

    const User = new mongoose.model("User" , userSchema);    // model

      
app.get("/" , function(req, res){
    res.render("home");
});


app.get("/login" , function(req, res){
    res.render("login");
});

app.get("/register" , function(req, res){
    res.render("register");
});


// app.post("/register" , function(req, res){
// const newUser = new User({       //document
//   email: req.body.username,
//   password: req.body.password
// });


// newUser.save(function(err){

// if(err){
//   console.log(err);
// }
// else{
//   res.render("secrets");
// }

// });

// });



app.post("/register", async function(req, res) {
  try {
    const newUser = new User({       //document
      email: req.body.username,
      password: req.body.password
    });

    await newUser.save();
    res.render("secrets");
  } catch (err) {
    console.error('Error while registering user:', err);
    // Handle the error or send an error response here.
  }
});


app.post("/login", async function(req, res){
 try{
  // const username = req.body.username;
  // const password = req.body.password;

  // User.findOne({email : username}, function(err, foundUser){
  //   if(foundUser){
  //     if(foundUser.password === password){
  //       res.render("secrets");
  //     }
  //   }
  // });
  const username = req.body.username;
  const password = req.body.password;

  const foundUser = await User.findOne({email: username});

  if (foundUser && foundUser.password === password) {
    res.render("secrets");
  } else {
    // Handle incorrect username or password here, e.g., show an error message.
    //res.send("Incorrect username or password");
    res.render("err");
  }
 }
 catch (err) {
  console.error('Error while registering user:', err);
  // Handle the error or send an error response here.
}
});








const port = 3000;  
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});

} catch (err) {
    console.error('Error connecting to the MongoDB server:', err);
  }
}
// Call the connect function
connect();
