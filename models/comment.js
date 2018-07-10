var mongoose = require('mongoose');

// Setup for comments collection
var CommentSchema = new mongoose.Schema({
    content: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Comment", CommentSchema);
