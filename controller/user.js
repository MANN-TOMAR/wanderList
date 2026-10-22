const User = require('../models/user');

module.exports.signUpForm = (req, res) => {
  res.render("../views/listings/signup.ejs");
}

module.exports.signUp = async (req, res) => {
  try {
    let signUp = req.body.signup;
    let fakeuser = new User({
      email: signUp.email,
      username: signUp.username,
    });
    let userData = await User.register(fakeuser, signUp.password);
    req.logIn(userData, (err) => {
      if (err) {
        return next(err);
      } else {
        req.flash("success", "Welcome To WanderLust");
        res.redirect("/listings");
      }
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
}

module.exports.loginForm =  (req, res) => {
  res.render("../views/listings/login.ejs");
}

module.exports.login = async (req, res) => {
    // res.send('Welcome to wanderLust');
    req.flash("success", "Welcome to wanderLust");
    let redirect = res.locals.redirectUrl || '/listings';
    res.redirect(redirect);
  }

  module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("success", "Logged out Successfully!");
      res.redirect("/listings");
    }
  });
}