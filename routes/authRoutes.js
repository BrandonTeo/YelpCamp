var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// Render `register/login` page
// NOT USED (REPLACED BY MODAL)
router.get('/authenticate', function(req, res) {
    res.render('auth/authentication');
});

// Register new user and authenticate new user
router.post('/register', function(req, res) {
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, registeredUser) {
        if(err) {
            req.flash('error', err.message + '.');
            res.redirect('back');
        } else {
            passport.authenticate("local")(req, res, function() {
                req.flash('success', "Successfully signed up.")
                res.redirect('back');
            });
        }
    });
});

// Authenticate `login` form
router.post('/login', passport.authenticate("local", {
    successRedirect: "back",
    failureRedirect: "back"
}), function(req, res) {});

// Logout current session user
router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', "Successfully logged out.");
    res.redirect("back");
});

module.exports = router;
