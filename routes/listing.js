const express = require("express");
const route = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {
  login,
  autherization,
  jiovalidation,
} = require("../views/Middleware.js");
const {
  renderListings,
  newListingForm,
  showListings,
  addNewListing,
  editListing,
  editListingForm,
  destroyListing,
} = require("../controller/listing.js");

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

route.route('/')
.get(wrapAsync(renderListings))
.post(login,jiovalidation,wrapAsync(addNewListing));
// .post(upload.single('listing[image]'),(req,res)=>{
//   console.log(req.file);
//   res.send(req.file);
// })

route.get("/new", login, newListingForm);

route.route('/:id')
.get(
  // login,
  // autherization,
  wrapAsync(showListings),
)
.patch(
  login,
  autherization,
  jiovalidation,
  wrapAsync(editListing),
)
.delete(login, autherization, wrapAsync(destroyListing));

route.get("/:id/edit", login, autherization, wrapAsync(editListingForm));

module.exports = route;
