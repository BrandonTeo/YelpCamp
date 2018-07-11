var mongoose = require('mongoose');

// Setup for posts collection
var postSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Post", postSchema);
