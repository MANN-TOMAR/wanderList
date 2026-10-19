const express = require("express");
const route = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require('../models/review.js');
const {jiovalidationForReview, login, autherizationForReview} = require('../views/Middleware.js');
const { addReview, deleteReview } = require("../controller/review.js");

route.post('/',login,jiovalidationForReview,wrapAsync(addReview));

route.delete('/:reviewId',login,autherizationForReview,wrapAsync(deleteReview));

module.exports = route;