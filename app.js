// Import neccessary libraries
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// Libraries required for user auth
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

// Connect to mongoDB database for this application
var dbName = 'yelpcamp_app';
mongoose.connect('mongodb://localhost/' + dbName);

// Setup for campgrounds collection
var postSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: String
});
var Post = mongoose.model("Post", postSchema);

// Setup for users collection
var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
UserSchema.plugin(passportLocalMongoose); // SUPERPOWER
var User = mongoose.model("User", UserSchema);

// Configure app.js settings
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(require("express-session")({
    secret: "Some-salt-here-is-fine",
    resave: false,
    saveUninitialized: false
}));

// Initialize passportJS & create protocol
app.use(passport.initialize());
app.use(passport.session());
var Protocol = new LocalStrategy(User.authenticate());

// Assign the SUPERPOWER methods to passportJS to ready our bouncer
passport.use(Protocol);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* Configure app-wide middleware so that every route runs it. MUST BE PLACED AFTER 
   `app.use(passport.initialize())` & `app.use(passport.session())` because we need 
   to utilize the session-cookies in order to maintain state(?) */
app.use(function(req, res, next) {
    res.locals.currUser = req.user;
    next();
});

// AUTH routes
app.get('/register', function(req, res) {
    res.render('register');
});

app.post('/register', function(req, res) {
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

app.get('/login', function(req, res) {
    res.render('login');
});

app.post('/login', passport.authenticate("local", {
    successRedirect: "/camps",
    failureRedirect: "/login"
}), function(req, res) {});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect("/camps");
});


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
            console.log("Error occurred on the camp INDEX route");
            res.render('wrong');
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
            console.log("Error occurred on the camp CREATE route");
            res.render('wrong');
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
            console.log("Error occurred on the camp SHOW route");
            res.render('wrong');
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
            console.log("Error occurred on the camp EDIT route");
            res.render('wrong');
        } else {
            res.render('edit', {post: foundPost});
        }
    });
});

// UPDATE route
app.put('/camps/:id', function(req, res) {
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
app.delete('/camps/:id', function(req, res) {
    Post.findByIdAndRemove(req.params.id, function(err, removedPost) {
        if(err) {
            console.log("Error occurred on the camp DESTROY route");
            res.render('wrong');
        } else {
            res.redirect('/camps');
        }
    });
});

// Route not available
app.get('*', function(req, res) {
    console.log("Attempt to access non-existent route");
    res.render('nopage');
});

// Listen to port 5555
app.listen(5555, function(req, res) {
    console.log("Server has started...");
});

