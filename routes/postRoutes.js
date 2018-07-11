var express = require('express');
var router = express.Router();
var Post = require("../models/post");
var middleware = require('./middleware');

// INDEX route
router.get('/camps', function(req, res) {
    Post.find({}, function(err, foundPosts) {
        if(err) {
            console.log("Error occurred on the camp INDEX route");
            res.render('wrong');
        } else {
            res.render('posts/index', {posts: foundPosts});
        }
    });
});

// NEW route
router.get('/camps/new', middleware.isLoggedIn, function(req, res) {
    // Simply render the `new` form
    res.render('posts/new');
});

// CREATE route
router.post('/camps', middleware.isLoggedIn, function(req, res) {
    var newPost = req.body.newPost;
    newPost["author"] = {
        id: req.user._id,
        username: req.user.username
    }
    Post.create(newPost, function(err, createdPost) {
        if(err) {
            console.log("Error occurred on the camp CREATE route");
            res.render('wrong');
        } else {
            // Redirects to the SHOW page of the newly added post
            res.redirect('/camps/' + createdPost._id);
        }
    });
});

// SHOW route (!!!) SHOW route has to be after NEW route (!!!)
router.get('/camps/:id', function(req, res) {
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost) {
        if(err) {
            console.log("Error occurred on the camp SHOW route");
            res.render('wrong');
        } else {
            res.render('posts/show', {post: foundPost});
        }
    });
});

// EDIT route
router.get('/camps/:id/edit', middleware.isPostOwner, function(req, res) {
    // Have to make sure post with id `:id` exists first
    Post.findById(req.params.id, function(err, foundPost) {
        if(err) {
            console.log("Error occurred on the camp EDIT route");
            res.render('wrong');
        } else {
            res.render('posts/edit', {post: foundPost});
        }
    });
});

// UPDATE route
router.put('/camps/:id', middleware.isPostOwner, function(req, res) {
    Post.findByIdAndUpdate(req.params.id, req.body.updatedPost, function(err, updatedPost) {
        if(err) {
            console.log("Error occurred on the camp UPDATE route");
            res.render('wrong');
        } else {
            res.redirect('/camps/' + updatedPost._id);
        }
    });
});

// DESTROY route
router.delete('/camps/:id', middleware.isPostOwner, function(req, res) {
    Post.findByIdAndRemove(req.params.id, function(err, removedPost) {
        if(err) {
            console.log("Error occurred on the camp DESTROY route");
            res.render('wrong');
        } else {
            res.redirect('/camps');
        }
    });
});

module.exports = router;
