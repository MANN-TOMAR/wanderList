const express = require("express");
const route = express.Router();
const User = require("../models/user");
const passport = require("passport");
const {saveRedirectUrl} = require('../views/Middleware.js');
const { signUpForm, signUp, loginForm, login, logout } = require("../controller/user.js");

route.route('/signup')
.get(signUpForm)
.post(signUp);

route.route('/login')
.get(loginForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  login,
);

route.get("/logout", logout);

module.exports = route;
