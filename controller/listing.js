const Listing = require("../models/listing");

module.exports.renderListings = async (req, res) => {
  let listings = await Listing.find({});
  res.render("./listings/index.ejs", { listings });
};

module.exports.newListingForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  let detail = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!detail) {
    req.flash("error", "Listing you are requested for does not exist!");
    res.redirect("/listings");
  } else {
    res.render("./listings/show.ejs", { detail });
  }
};

module.exports.addNewListing = async (req, res) => {
  console.log(req.body.listing);
  let list = new Listing(req.body.listing);
  list.owner = req.user._id;
  await list.save();
  req.flash("success", "New Listing Added!");
  res.redirect("/listings");
};

module.exports.editListingForm = async (req, res) => {
  let { id } = req.params;
  let detail = await Listing.findById(id);
  if (!detail) {
    req.flash("error", "Listing you are requested for does not exist!");
    res.redirect("/listings");
  } else {
    res.render("./listings/edit.ejs", { detail });
  }
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  await Listing.updateOne({ _id: id }, req.body.listing);
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
