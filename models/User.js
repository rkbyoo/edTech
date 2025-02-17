const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
    },
    password:{
        type:String
        ,required:true
    },
    additonalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Profile",
    },
    image: {
        type: String,
        required: false
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
    courseProgress: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseProgress"
    }],
    contactNumber: {
        type: Number,
        required: false
    },
    token: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    ratingAndReview: {
        type: mongoose.Types.ObjectId,
        required: false
    }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
