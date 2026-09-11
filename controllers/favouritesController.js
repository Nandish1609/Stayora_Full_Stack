const Listing = require("../models/listing");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");

module.exports.getFavourites = async (req, res, next) => {
    let user = await User.findById(req.user._id).populate("favourites");
    res.render("./listings/favourites.ejs", { favourites: user.favourites });
};

module.exports.removeFavourite = async (req, res) => {
    const { id } = req.params;

    await User.findByIdAndUpdate(req.user._id, {
        $pull: { favourites: id },
    });

    req.flash("success", "Listing removed from favourites.");
    res.redirect(`/listings/${id}`);
};

module.exports.postFavourite = async (req, res, next) => {
    let { id } = req.params;
    await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { favourites: id },
    });
    req.flash("success", "Listing saved to favourites.");
    res.redirect(`/listings/${id}`);
};
