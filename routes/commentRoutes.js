var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var Post = require('../models/post');
var middleware = require('./middleware');

// CREATE route
router.post('/camps/:id/comments', middleware.isLoggedIn, function(req, res) {
    Post.findById(req.params.id, function(err, foundPost) {
        if(err) {
            req.flash('error', "Unable to find listing.");
            res.redirect('back');
        } else {
            var newComment = req.body.newComment;
            newComment["author"] = {
                id: req.user._id,
                username: req.user.username
            }
            Comment.create(newComment, function(err, createdComment) {
                if(err) {
                    req.flash('error', "Unable to create comment.");
                    res.redirect('back');
                } else {
                    foundPost.comments.push(createdComment._id);
                    foundPost.save()
                    res.redirect('/camps/' + req.params.id);
                }
            });
        }
    });
});

// NOT USED (REPLACED BY MODAL)
router.get('/camps/:id/comments/:cid/edit', middleware.isCommentOwner, function(req, res) {
    // Have to make sure post with id `:id` exists first
    Comment.findById(req.params.cid, function(err, foundComment) {
        if(err) {
            req.flash('error', "Unable to find comment.");
            res.redirect('back');
        } else {
            res.render('comments/edit', {postID: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE route
router.put('/camps/:id/comments/:cid', middleware.isCommentOwner, function(req, res) {
    Comment.findByIdAndUpdate(req.params.cid, req.body.updatedComment, function(err, updatedComment) {
        if(err) {
            req.flash('error', "Unable to update comment.");
            res.redirect('back');
        } else {
            req.flash('success', "Sucessfully updated comment.");
            res.redirect('/camps/' + req.params.id);
        }
    });
});

// DESTROY route
router.delete('/camps/:id/comments/:cid', middleware.isCommentOwner, function(req, res) {
    Comment.findByIdAndRemove(req.params.cid, function(err, removedPost) {
        if(err) {
            console.log("Error occurred when trying to remove comment");
            res.render('wrong');
        } else {
            req.flash('success', "Sucessfully deleted comment.")
            res.redirect('/camps/' + req.params.id);
        }
    });
});

module.exports = router;
