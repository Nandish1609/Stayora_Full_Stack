const Listing = require("../models/listing");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");

module.exports.indexPage = async (req, res, next) => {
    let allListing = await Listing.find({});
    const favouriteIds = req.user ? req.user.favourites : [];
    res.render("./listings/index.ejs", { allListing, favouriteIds });
};

module.exports.getNewListingForm = (req, res) => {
    res.render("./listings/newListing.ejs");
};

module.exports.postNewListing = async (req, res, next) => {
    let { title, description, price, location, country } = req.body;
    let url = req.file.path;
    let filename = req.file.filename;

    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)},${encodeURIComponent(country)}&format=geojson&limit=1`,
        {
            headers: {
                Accept: "application/json",
                "User-Agent": "stayora/1.0",
            },
        },
    );

    const geoData = await response.json();

    let newListing = await Listing.insertOne({
        title: title,
        description: description,
        image: {
            filename: filename,
            url: url,
        },
        price: price,
        location: location,
        geometry: geoData.features[0].geometry,
        country: country,
        owner: {
            _id: req.user._id,
        },
    });
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing added Successfully.");
    res.redirect(`${req.path}`);
};

module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    const isFavourite =
        req.user &&
        req.user.favourites.some((favouriteId) =>
            favouriteId.equals(listing._id),
        );

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("./listings/show.ejs", { listing, isFavourite });
};

module.exports.getEditListingForm = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    req.flash("success", "Listing Edited Successfully.");
    res.render("./listings/edit.ejs", { listing });
};

module.exports.putEditListing = async (req, res, next) => {
    let { id } = req.params;
    let { title, description, price, location, country } = req.body;
    let updateListing = await Listing.findByIdAndUpdate(
        id,
        {
            title: title,
            description: description,
            price: price,
            location: location,
            country: country,
        },
        { runValidators: true, returnDocument: "after" },
    );
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updateListing.image = { url, filename };
        await updateListing.save();
    }

    req.flash("success", "Listing Updated Successfully.");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res, next) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    await User.updateMany({}, { $pull: { favourites: id } });
    req.flash("success", "Listing Deleted Successfully.");
    res.redirect("/listings");
};
