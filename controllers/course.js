const Course=require("../models/Course")
const User=require("../models/User")
const {uploadToCloudinary}=require("../utils/imageUploader")
const Category = require("../models/Category")

//create course 

exports.createCourse=async(req,res)=>{
    try {
        //data fetch 
        const {courseName,courseDescription,whatYouWillLearn,price,category}=req.body //here the category id is in req body
        //get thumbnail
        const thumbnail=req.files.thumbnailImage
        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail){
            return res.status(401).json({
                success:false,
                message:"Please fill up all the details"
            })
        }
        //check for instructor 
        const userId=req.user.id
        const instructorDetails=await User.findById({userId})
        console.log("instructor Details",instructorDetails)
        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor details not found"
            })
        }

        //check given tag is valid or not
        const categoryDetails=await Category.findById({category})
        if(!categoryDetails)
        {
            return res.status(404).json({
                success:false,
                message:"category is not found/Invalid"
            })
        }

        //upload image to cloudinary
        const thumbnailImage=await uploadToCloudinary(thumbnail,process.env.FOLDER_NAME)

        //create an entry for new course
        const newCourse=await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn,
            price,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url
        })

        //add the new user to the user schema of instructor
        await User.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {$push:{courses:newCourse._id}}
            ,{new:true}
        )
        //update the tag schema
        await Tag.findByIdAndUpdate({tag},{$push:{course:newCourse._id}},{new:true})
        
        //return res
        return res.status(200).json({
            success:true,
            message:"Course Created successfully",
            data:newCourse
        })

    } catch (error) {
        console.error("some error while creating course",error)
        return res.status(500).json({
            success:false,
            message:"Internal server error while creating course"
        })
    }
}

//get course details

exports.getCourseDetails=async(req,res)=>{
    try {
        //fetch the courseId 
    const {courseId}=req.body
    //validate the course id 
    if(!courseId){
        return res.status(404).json({
            success:false,
            message:"course id didnot found"
        })
    }
    const courseDetails=await Course.findById(courseId).populate({path:"instructor",populate:{path:"additionalDetails"}})
    .populate("category").populate("ratingAndReview").populate({path:"courseContent",populate:{path:"subSection"}})
    if(!courseDetails){
        return res.status(400).json({
            success:false,
            message:"no course details found"
        })
    }

    //return res
    return res.status(200).json({
        success:true,
        message:"The course Detail has been fetched successfully"
        ,data:courseDetails
    })
    } catch (error) {
        console.error("some error while course get function",error)
        return res.status(500).json({
            success:false,
            message:"internal server error while get course details "
        })
    }
    
}



//get all courseshandler function

exports.showAllCourses=async(req,res)=>{
    try {

        //TODO change the below statement
        const allCourseDetails=await Course.find({})
        return res.status(200).json({
            success:true,
            message:"All the details of courses are successfully fetched"
            ,data:allCourseDetails
        })
    } catch (error) {
        console.log("some error while getting course details",error)

        return res.status(500).json({
            success:false,
            message:"internal server error while fetching course details"
        })
    }
}