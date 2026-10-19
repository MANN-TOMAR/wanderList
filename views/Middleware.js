const { listingSchema, reviewSchema } = require('../jio');
const Listing = require('../models/listing');
const Review = require('../models/review.js');
const expressError = require("../utils/expressError.js");


function login(req,res,next){
   if (!req.isAuthenticated()) {
    // console.log(req.originalUrl);
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "User Must be Logged In!");
    res.redirect("/login");
  }else{
  next();
  } 
}

function saveRedirectUrl(req,res,next){
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

async function autherization(req,res,next) {
  let { id } = req.params;
    let listingOwner = await Listing.findById(id);
  if(!(listingOwner.owner._id.equals(res.locals.currentUser._id) && res.locals.currentUser)){
      req.flash('error',"You are not the Owner Of this Listing!");
      return res.redirect(`/listings/${id}`);
  }
  next();
}

function jiovalidation(req, res, next) {
  console.log(req.body.listing);
  let { error } = listingSchema.validate(req.body.listing);

  // console.log(result);
  if (error) {
    let errMessage = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMessage);
  } else {
    next();
  }
}

function jiovalidationForReview(req, res, next) {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMessage = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMessage);
  } else {
    next();
  }
}

async function autherizationForReview(req,res,next) {
  let { id,reviewId } = req.params;
    let reviewAuthor = await Review.findById(reviewId);
  if(!(reviewAuthor.author._id.equals(res.locals.currentUser._id) && res.locals.currentUser)){
      req.flash('error',"You are not the Author Of this Review!");
      return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports = {login,saveRedirectUrl,autherization,jiovalidation,jiovalidationForReview,autherizationForReview};