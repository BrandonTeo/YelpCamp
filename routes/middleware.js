var Comment = require('../models/comment');
var Post = require('../models/post');
var middleware = {};

// Checks if a user is currently logged in
middleware["isLoggedIn"] = function(req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        req.flash('error', "You need to be logged in to do that.");
        res.redirect('/camps');
    }
}

// Checks if the current user is the owner of post
// Not really used because we only show buttons if user is owner of post
middleware["isPostOwner"] = function(req, res, next) {
    if(req.isAuthenticated()) {
        Post.findById(req.params.id, function(err, foundPost) {
            if(err) {
                req.flash('error', "Unable to find post in database.");
                res.redirect('back');
            } else if(foundPost.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash('error', "You don't have permission to do that.");
                res.redirect('back');
            }
        });
    } else {
        req.flash('error', "You don't have permission to do that.");
        res.redirect('back');
    }
}

// Checks if the current user is the owner of comment
// Not really used because we only show buttons if user is owner of comment
middleware["isCommentOwner"] = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.cid, function(err, foundComment) {
            if(err) {
                req.flash('error', "Unable to find comment in database.");
                res.redirect('back');
            } else if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash('error', "You don't have permission to do that.");
                res.redirect('back');
            }
        });
    } else {
        req.flash('error', "You don't have permission to do that.");
        res.redirect('back');
    }
}

module.exports = middleware;
