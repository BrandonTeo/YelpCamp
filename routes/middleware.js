var Comment = require('../models/comment');
var Post = require('../models/post');
var middleware = {};

// Checks if a user is currently logged in
middleware["isLoggedIn"] = function(req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/authenticate');
    }
}

// Checks if the current user is the owner of post
// Not really used because we only show buttons if user is owner of post
middleware["isPostOwner"] = function(req, res, next) {
    if(req.isAuthenticated()) {
        Post.findById(req.params.id, function(err, foundPost) {
            if(err) {
                console.log("Error occurred when trying to find post");
                res.render('wrong');
            } else if(foundPost.author.id.equals(req.user._id)) {
                next();
            } else {
                console.log("You don't have permission to perform this action");
                res.render('wrong');
            }
        });
    } else {
        res.redirect('/authenticate');
    }
}

// Checks if the current user is the owner of comment
// Not really used because we only show buttons if user is owner of comment
middleware["isCommentOwner"] = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.cid, function(err, foundComment) {
            if(err) {
                console.log("Error occurred when trying to find comment");
                res.render('wrong');
            } else if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                console.log("You don't have permission to perform this action");
                res.render('wrong');
            }
        });
    } else {
        res.redirect('/authenticate');
    }
}

module.exports = middleware;
