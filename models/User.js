const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
    },
    additonalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profile",
    },
    image: {
        type: String,
        required: true
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

// ✅ Prevent overwriting the model
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
