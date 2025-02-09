const mongoose=require("mongoose")
const Category = require("./Category")
const courseSchema=mongoose.Schema({
    courseName:{
        type:String
    },
    courseDescription:{
        type:String,
        required:true
    }
    ,instructor:{
        type:mongoose.Schema.Types.objectId
        ,ref:"User",
        required:true
    },
    whatYouWillLearn:{
        type:String,
        trim:true
    },
    courseContent:[{
        type:mongoose.Schema.Types.objectId,
        ref:"Section"
    }],
    ratingAndReviews:[{
        type:mongoose.Schema.Types.objectId,
        ref:"RatingAndReview",
    }],
    Price:{
        type:Number
    }
    ,thumbnail:{
        type:String
    },
    category:[{
        type:mongoose.Schema.Types.objectId,
        ref:"Category"
    }],
    studentEnrolled:[{
        type:mongoose.Schema.Types.objectId
        ,required:true,
        ref:"User"
    }]

})

module.exports=mongoose.model("SubSection",courseSchema)