const Review = require('../models/review');
const Listing = require('../models/listing');

module.exports.addReview = async(req,res,next)=>{
  let {id} = req.params;
  let review = req.body.review;
  // console.log(review,id);
  let addReview = new Review(req.body.review);
  let listing = await Listing.findById(id);
  addReview.author = req.user._id;
  console.log(addReview);
  listing.reviews.push(addReview);
  await addReview.save();
  await listing.save();
  // throw alert('hello');
  req.flash('success',"Review Added!");
  res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async (req,res)=>{
  let {id,reviewId} = req.params;
  // console.log(id,reviewId);
    await Listing.findByIdAndUpdate(id,{$pull : {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
  req.flash('success',"Review Deleted!");
  res.redirect(`/listings/${id}`);
}