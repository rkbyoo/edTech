//to create rating and review controller
const RatingAndReview=require("../models/RatingAndReview")
const Course=require("../models/Course")
const User=require("../models/User")
const Course = require("../models/Course")
const { default: mongoose } = require("mongoose")


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
//check the course id is valid or not also check that user alredy exists in rating or not(kind of authZ)
    const courseDetails=await Course.findById({_id:courseId,studentEnrolled:{$eleMatch:{$eq:userId}}})
    if(!courseDetails){
        return res.status(404).json({
            success:false,
            message:"student is not enrolled in the course"
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
    } 
catch (error) {
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
    try {
        //get course ID
    const courseId=req.body.courseId
    //calculate avg rating
    const result=await RatingAndReview.aggregate([
        {
            $match:{
                course:new mongoose.Types.ObjectId({courseId}) 
                //it finds the entry which consists of this courseId which is a object id
            }
        }
        ,{
            $group:{
                _id:null,
                averageRating:{$avg:"$rating"}
                //group downs the courseId objects and then perform avg operation on rating parameter
            }
        }
    ])
    //return rating
    if(result.length>0){
        return res.status(200).json({
            success:true,
            averageRating:result[0].averageRating
        })
    }
    //if no rating review exists 
    return res.status(200).json({
        success:true,
        averageRating:"average Rating is 0,no ratings given till now"
    })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"some error occured cgetting avg ratings"
        })
    }
    
}



//create getallrating

exports.getAllRating=async(req,res)=>{
    try {
        const allRatingDetails=await RatingAndReview.find({}).sort({rating:"desc"})
        .populate({path:"user",select:"firstName lastName email image" })
        .populate({path:"course",select:"courseName"}).exec()
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


//course specific get rating and review
exports.getCourseRating=async(req,res)=>{
    try {
       //get course id
       const courseId=req.body.courseId
       //find that course id entry in the Course schema and then populate it on rating and review and user only
       const courseDetail=await Course.findOne({_id:courseId},{ratingAndReview:true}).populate({path:"ratingAndReview",select:"user review rating"}).exec()
       //return res
       return res.status(200).json({
        success:true,
        message:"course details are fetched successfully"
        ,data:courseDetail
       })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"some error occured while fetching specific course ratings"
        })
    }
}