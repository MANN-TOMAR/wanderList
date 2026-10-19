const express = require("express");
const app = express();
// const ejs = require("ejs");
app.set("view engine", "ejs");
const path = require("path");
app.set("views", path.join(__dirname, "views"));
const mongoose = require("mongoose");
const main = async () => {
  mongoose.connect("mongodb://127.0.0.1:27017/wanderList");
};
main()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
const expressError = require("./utils/expressError.js");
const listingsRoute = require('./routes/listing.js');
const reviewRoute = require('./routes/review.js');
const signUpRoute = require("./routes/user.js");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require("passport-local");
const User = require('./models/user.js');

app.listen(8000, () => {
  console.log("App is listening");
});

const sessionArgument = {
  secret:'my secretCode',
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly:true,
  }
}

app.use(session(sessionArgument));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
});

// Insert fake data in signup
// app.get('/demouser',async (req,res)=>{
//   let fakeuser = new User({
//     email:'manntomar46@gmail.com',
//     username:"Mann Tomar"
//   });
//   let userData = await User.register(fakeuser,'543210mann');
//   res.send(userData);
// });

app.get("/", (req, res) => {
  res.send("Hii! I am root");
});
app.use('/listings',listingsRoute);
app.use('/listings/:id/review',reviewRoute);
app.use('/',signUpRoute);

app.all("/{*splat}", (req, res, next) => {
  next(new expressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
});
