var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose'); // Required for passportJS

// Setup for users collection
var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
UserSchema.plugin(passportLocalMongoose); // SUPERPOWER

module.exports = mongoose.model("User", UserSchema);
