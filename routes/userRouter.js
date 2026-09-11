const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const usersController = require("../controllers/usersController");

router
    .route("/signup")
    .get(usersController.getSignUpForm)
    .post(wrapAsync(usersController.postSignUp));

router
    .route("/login")
    .get(usersController.getLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: "Incorrect Username or Password!",
        }),
        usersController.postLogin,
    );

router.get("/logout", usersController.postLogout);

module.exports = router;
