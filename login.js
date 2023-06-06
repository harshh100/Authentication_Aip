const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const ejs = require("ejs");
var flash = require("connect-flash");
const mongoose = require("mongoose");
const app = express();

// configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(flash());
mongoose.set("strictQuery", false);

// configure session
app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

// configure passport
app.use(passport.initialize());
app.use(passport.session());

// configure passport to use LocalStrategy for authentication
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email }, (err, user) => {
      // console.log(user);
      if (err) return done(err);
      if (!user) {
        return done(null, false, { message: "Invalid email or password" });
      }
      if (user.password !== password) {
        return done(null, false, { message: "Invalid email or password" });
      }
      return done(null, user);
    });
  })
);


// serialize user for session storage
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize user from session storage
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if (err) return done(err);
    done(null, user);
  });
});

app.post(
  "/login",
  passport.authenticate("local", {
    // successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    usernameField: "email",
  }),function(req, res) {
    if (req.body.remember) {
      // Set a cookie that expires in 30 days
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    } //else {
    //   // Delete the cookie when the browser is closed
    //   req.session.cookie.expires = false;
    // }
    res.redirect('/');
  }
);
