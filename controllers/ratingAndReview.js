//to create rating and review controller



const RatingAndReview=require("../models/RatingAndReview")
const Course=require("../models/Course")
const User=require("../models/User")
const Course = require("../models/Course")


//to create a rating and review(TODO add the course id thing in it )

exports.createRatingAndReview=async(req,res)=>{
    try {
        //fetch the rating and review datas 
const userId=req.user.id
const {review,rating,courseId}=req.body
//check validation of data
if(!userId || !rating || !review){
    return res.status(404).json({
        success:false,
        message:"required field are missing"
    })
}
//check the user and course id is valid or not also check that user alredy exists in rating or not
const userDetails=User.findById(userId)
const courseDetails=await Course.findById({_id:courseId,studentEnrolled:{$eleMatch:{$eq:userId}}})
if(!courseDetails){
    return res.status(404).json({
        success:false,
        message:"student is nor enrolled in the course"
    })
}
//check user already reviewed or not 
const alreadyReviewed=await RatingAndReview.findOne({user:userId,course:courseId})
if(alreadyReviewed){
    return res.status(401).json({
        success:false,
        message:"User already reviewed the course"
    })
}
//create rating and update user and course schema 
const ratingDetails=await RatingAndReview.create({user:userId,course:courseId,review,rating},{new:true})
await User.findOneAndUpdate({userId},{$push:{ratingAndReview:ratingDetails._id}},{new:true})
await Course.findOneAndUpdate({courseId},{$push:{ratingAndReview:ratingDetails._id}})

//return res
return res.status(200).json({
    success:true,
    message:"Rating and review created successfully",
    data:ratingDetails
})
    } catch (error) {
        console.error("some error while creating rating and review")
        return res.status(500).json({
            success:false,
            message:"internal server error while creating course"
        })
    }

}


//update rating and review


// exports.updateRatingAndReview=(req,res)=>{
//     const {courseId}
// }



//create getavgrating
exports.getAvgRating=async(req,res)=>{
    const allRating=await RatingAndReview.find({})
}



//create getallrating

exports.getAllRating=async(req,res)=>{
    try {
        const allRatingDetails=await RatingAndReview.find({})
        if(!allRatingDetails){
            return res.status(404).json({
                success:false,
                message:"no ratings available"
            })
        }
        res.status(200).json({
            success:true,
            message:" all rating fetched"
            ,data:ratingDetails
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"some error occured while fetching ratings"
        })
    }
}
