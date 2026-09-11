const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewsController = require("../controllers/reviewsController");

//Review Route
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewsController.postReview),
);

//Review Delete Route
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewsController.deleteReview),
);

module.exports = router;
