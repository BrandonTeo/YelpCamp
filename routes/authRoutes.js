var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// Render `register` page
router.get('/register', function(req, res) {
    res.render('auth/register');
});

// Register new user and authenticate new user
router.post('/register', function(req, res) {
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, registeredUser) {
        if(err) {
            console.log("Error occurred on the user CREATE route");
            res.render('wrong');
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/camps");
            });
        }
    });
});

// Render `login` page
router.get('/login', function(req, res) {
    res.render('auth/login');
});

// Authenticate `login` form
router.post('/login', passport.authenticate("local", {
    successRedirect: "/camps",
    failureRedirect: "/login"
}), function(req, res) {});

// Logout current session user
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect("/camps");
});

module.exports = router;
