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
    accountType:{
        type:String,
        enum: ["Admin", "Student", "Instructor"],
        required:true
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required:true
    },
    image: {
        type: String,
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
    },
    token: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    ratingAndReview: {
        type: mongoose.Schema.Types.ObjectId,
    }
    
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
