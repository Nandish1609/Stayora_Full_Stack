const User = require("../models/user");

module.exports.getSignUpForm = (req, res) => {
    res.render("users/signUp.ejs");
};

module.exports.postSignUp = async (req, res) => {
    try {
        let { email, username, password } = req.body;
        const newUser = new User({
            email: email,
            username: username,
        });
        const regUser = await User.register(newUser, password);
        req.login(regUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Stayora!");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("vError", "Username Already Exist! Try other.");
        res.redirect("/signup");
    }
};

module.exports.getLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.postLogin = async (req, res) => {
    req.flash("success", "Login Successful!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.postLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are Logged Out!");
        res.redirect("/listings");
    });
};
