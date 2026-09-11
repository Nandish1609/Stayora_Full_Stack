const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.postReview = async (req, res) => {
    let { id } = req.params;
    let { rating, comment, created_at } = req.body;
    let listing = await Listing.findById(id);
    let newReview = new Review({
        rating: rating,
        comment: comment,
        created_at: created_at,
        author: req.user._id,
    });
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review Submitted Successfully.");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully.");
    res.redirect(`/listings/${id}`);
};
