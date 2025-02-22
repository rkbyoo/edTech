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
        type:mongoose.Schema.Types.ObjectId
        ,ref:"User",
        required:true
    },
    whatYouWillLearn:{
        type:String,
        trim:true
    },
    courseContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section"
    }],
    ratingAndReviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview",
    }],
    Price:{
        type:Number
    }
    ,thumbnail:{
        type:String
    },
    tags:{
        type:[String],
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    studentEnrolled:[{
        type:mongoose.Schema.Types.ObjectId
        ,required:true,
        ref:"User"
    }],
    instructions:{
        type:[String]
    },
    status:{
        type:String,
        enum:["Drafts","Published"],
        default:"Drafts"
    }

})

module.exports=mongoose.model("Course",courseSchema)