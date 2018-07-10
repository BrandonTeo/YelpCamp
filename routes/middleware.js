var Comment = require('../models/comment');
var Post = require('../models/post');
var middleware = {};

middleware["isLoggedIn"] = function(req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

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
        res.redirect('/login');
    }
}

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
        res.redirect('/login');
    }
}

module.exports = middleware;
