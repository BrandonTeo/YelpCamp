// Import neccessary libraries
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// Setup mongoDB
var dbName = 'yelpcamp_app';
mongoose.connect('mongodb://localhost/' + dbName);
var postSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: String
});
var Post = mongoose.model("Post", postSchema);

// Seed database
// Post.create({title: "Camp1", content: "This is Camp1....", image: "https://i2.wp.com/beebom.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg"});
// Post.create({title: "Camp2", content: "This is Camp2....", image: "https://i2.wp.com/beebom.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg"});
// Post.create({title: "Camp3", content: "This is Camp3....", image: "https://i2.wp.com/beebom.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg"});

// Configure app.js settings
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// RESTFUL routes
// Landing page
app.get('/', function(req, res) {
    // Redirect this route to the INDEX route for now
    res.redirect('/camps');
});

// INDEX route
app.get('/camps', function(req, res) {
    Post.find({}, function(err, foundPosts) {
        if(err) {
            console.log("Error occurred on the INDEX route");
        } else {
            res.render('index', {posts: foundPosts});
        }
    });
});

// NEW route
app.get('/camps/new', function(req, res) {
    // Simply render the `new` form
    res.render('new');
});

// CREATE route
app.post('/camps', function(req, res) {
    Post.create(req.body.newPost, function(err, createdPost) {
        if(err) {
            console.log("Error occurred on the CREATED route");
        } else {
            // Redirects to the SHOW page of the newly added post
            res.redirect('/camps/' + createdPost._id);
        }
    });
});

// SHOW route (!!!) SHOW route has to be after NEW route (!!!)
app.get('/camps/:id', function(req, res) {
    Post.findById(req.params.id, function(err, foundPost) {
        if(err) {
            console.log("Error occurred on the SHOW route");
        } else {
            res.render('show', {post: foundPost});
        }
    });
});

// EDIT route
app.get('/camps/:id/edit', function(req, res) {
    // Have to make sure post with id `:id` exists first
    Post.findById(req.params.id, function(err, foundPost) {
        if(err) {
            console.log("Error occurred on the EDIT route");
        } else {
            res.render('edit', {post: foundPost});
        }
    });
});

// UPDATE route
app.put('/camps/:id', function(req, res) {
    Post.findByIdAndUpdate(req.params.id, req.body.updatedPost, function(err, updatedPost) {
        if(err) {
            console.log("Error occurred on the UPDATE route");
        } else {
            res.redirect('/camps/' + updatedPost._id);
        }
    });
});

// DESTROY route
app.delete('/camps/:id', function(req, res) {
    Post.findByIdAndRemove(req.params.id, function(err, removedPost) {
        if(err) {
            console.log("Error occurred on the DESTROY route");
        } else {
            res.redirect('/camps');
        }
    });
});

// Route not available
app.get('*', function(req, res) {
    res.send("The file you requested isn't available");
});

// Listen to port 5555
app.listen(5555, function(req, res) {
    console.log("Server has started...");
});

