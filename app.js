// Import neccessary libraries
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// Libraries required for user auth
var passport = require("passport");
var LocalStrategy = require("passport-local");

// Connect to mongoDB database and import models
var dbName = 'yelpcamp_app';
mongoose.connect('mongodb://localhost/' + dbName);
var User = require('./models/user');
var Comment = require('./models/comment');
var Post = require('./models/post');

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


// --------------- App Routes --------------- //
// Landing page
app.get('/', function(req, res) {
    // Redirect this route to the INDEX route for now
    res.redirect('/camps');
});

// Import route modules
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/postRoutes'));
app.use("/", require('./routes/commentRoutes'));

// Route not available
app.get('*', function(req, res) {
    console.log("Attempt to access non-existent route");
    res.render('nopage');
});
// ------------------------------------------ //


// Listen to port 5555
app.listen(5555, function(req, res) {
    console.log("Server has started...");
});
