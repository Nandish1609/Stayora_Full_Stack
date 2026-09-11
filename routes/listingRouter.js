const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingsController = require("../controllers/listingsController");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

router
    .route("/")
    .get(wrapAsync(listingsController.indexPage))
    .post(
        isLoggedIn,
        upload.single("url"),
        validateListing,
        wrapAsync(listingsController.postNewListing),
    );

// Add new Listing
router.get("/new", isLoggedIn, listingsController.getNewListingForm);

router
    .route("/:id")
    .get(wrapAsync(listingsController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("url"),
        validateListing,
        wrapAsync(listingsController.putEditListing),
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingsController.deleteListing));

// Edit Route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingsController.getEditListingForm),
);

module.exports = router;
