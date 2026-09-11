const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const favouritesController = require("../controllers/favouritesController");
const { isLoggedIn } = require("../middleware");

router.get(
    "/favourites",
    isLoggedIn,
    wrapAsync(favouritesController.getFavourites),
);

router.post(
    "/listings/:id/favourite",
    isLoggedIn,
    wrapAsync(favouritesController.postFavourite),
);

router.delete(
    "/listings/:id/favourite",
    isLoggedIn,
    wrapAsync(favouritesController.removeFavourite),
);

module.exports = router;
