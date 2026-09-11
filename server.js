if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listingRouter = require("./routes/listingRouter");
const reviewRouter = require("./routes/reviewRouter");
const userRouter = require("./routes/userRouter");
const favouriteRouter = require("./routes/favouriteRouter");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const multer = require("multer");

const ExpressError = require("./utils/ExpressError");
const app = express();
const PORT = Number(process.env.PORT) || 4040;
const dbURL = process.env.ATLASDB_URL;

if (!dbURL) {
    throw new Error("ATLASDB_URL must be set before starting the server.");
}

const databaseConnection = mongoose.connect(dbURL);
const mongoClientPromise = databaseConnection.then(() => mongoose.connection.getClient());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const store = MongoStore.create({
    clientPromise: mongoClientPromise,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600
})

store.on("error", (err) => {
    console.error("Error in Mongo session store.", err);
})

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listingRouter);

app.use("/listings/:id/reviews", reviewRouter);

app.use("/", userRouter);

app.use("/", favouriteRouter);

app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

//Error Handling Middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { statusCode, message });
});

async function start() {
    try {
        await databaseConnection;
        console.log("MongoDB connected.");
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`App is listening at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Unable to start the server.", err);
        process.exitCode = 1;
    }
}

start();
