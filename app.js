//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

const app = express();

console.log(process.env.API_KEY);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true});

// MONGOOSE SCHEMA

const userSchema = new mongoose.Schema({   // MONGOOSE-ENCRYPTION SCHEMA TO BINARY CODE.WHEN WE LOOK STUDIO 3 OUR DATEBASE WITH THIS CODE, WE LOOK ENCRYPTED USERNAME AND PASSWORD TO BINARY. WHEN WE HACKED IS THE HARD WAY TO SEE OUR DATA IN DATABASE.
  email: String,
  password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] }); // THIS PLUGIN ENCRYPT SCEMA REFERS ONLY ON PASSWORD.WE COULD WRITE "PASSWORD, EMAIL". THE WOULD BE BINARY CODE NOT ONLY FOR PASSWORD BUT ALSO FOR EMAIL.

const User = new mongoose.model("User", userSchema);


// GET REQUEST TO SEND US TO HOME, LOGIN AND REGISTER PAGE. SECRET PAGE I DONT WRITE BECAUSE USER WHEN HE REG OR LOGIN SHULD BE REDIRECT TO SECRERET PAGE. WITHOUT REG OR LOGIN HE CAN'T TO APPROACHES.

app.get("/", function(req, res){
  res.render("home");
});


app.get("/login", function(req, res){
  res.render("login");
});



app.get("/register", function(req, res){
  res.render("register");
});


// CODE FOR REGISTER PAGE. FUNCTION WHEN USER LOG EMAIL AND PASSWORD, AFTER THAT SHOULD BE REDIRECT TO SECRET PAGE.

app.post("/register", function(req, res){
  const newUser = new User({
    email:req.body.username,       // THIS IS IMPORTANT. THIS DATA (EMAIL AND PASSWORD) MUST BE ENTERED
    password:req.body.password
  });

  newUser.save().then(()=>{
    res.render("secrets");          // OVERHERE I SAVE THIS POST, AND AFTER THAT CLIENT IS REDIRECT TO SECRET PAGE.
  }).catch((err)=>{
    console.log(err);
  });
});


app.post("/login",function(req, res){     // THIS IS IMPORTANT. THIS DATA (USERNAME AND PASSWORD) MUST BE ENTERED WHEN WE LOG IN TO WEBSITE AFTER WE REGISTER ON THE SAME.
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}).then((foundUser)=>{
    if(foundUser){                                              // OVERHERE I WRITE THIS CODE WHERE WE FIND USER WHO IS REGISTER,IF DATA EMAIL IS THE SAME WITH PASSWORD, AFTER THAT CLIENT IS REDIRECT TO SECRET PAGE, OTHERWAY CLIENT BE REJECTED.
      if(foundUser.password === password){
        res.render("secrets");
      }
    }
  }).catch((err)=>{
    console.log(err);
  });
});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
