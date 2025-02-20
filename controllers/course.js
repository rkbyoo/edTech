const Course=require("../models/Course")
const User=require("../models/User")
const {uploadToCloudinary}=require("../utils/imageUploader")
const Category = require("../models/Category")
const { default: mongoose } = require("mongoose")

//create course 

exports.createCourse = async (req, res) => {
    try {
        // Extract data
        const { courseName, courseDescription, whatYouWillLearn, price, categoryId, tags, instructions } = req.body;
        const thumbnail = req.files?.thumbnailImage;

        // Validate required fields
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !categoryId || !thumbnail || !tags || !instructions) {
            return res.status(400).json({
                success: false,
                message: "Please fill up all the details",
            });
        }

        // Ensure `req.user` is set correctly
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }

        const userId = req.user.id;

        // Check instructor details
        const instructorDetails = await User.findById(userId);
        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor details not found",
            });
        }

        // Validate category
        const categoryDetails = await Category.findById(categoryId);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category not found or invalid",
            });
        }

        // Upload image to Cloudinary
        const thumbnailImage = await uploadToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // Create new course entry
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: userId,
            whatYouWillLearn,
            price,
            tags,
            instructions,
            category: categoryId,
            thumbnail: thumbnailImage.secure_url,
        });

        // Update User model (Instructor's courses)
        await User.findByIdAndUpdate(userId, { $push: { courses: newCourse._id } }, { new: true });

        // Update Category model
        await Category.findByIdAndUpdate(categoryId, { $push: { courses: newCourse._id } }, { new: true });

        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: newCourse,
        });

    } catch (error) {
        console.error("Error while creating course:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while creating course",
        });
    }
}


//get course details

exports.getCourseDetails=async(req,res)=>{
    try {
        //fetch the courseId 
    const courseId=req.params.id
    //validate the course id 
    if(!courseId){
        return res.status(404).json({
            success:false,
            message:"course id didnot found"
        })
    }
    const courseDetails=await Course.findById(courseId).populate({path:"instructor",populate:{path:"additionalDetails"}})
    .populate("category")
    //.populate("ratingAndReview")
    .populate({path:"courseContent",populate:{path:"SubSection"}}).exec()
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
        .populate({path:"instructor",populate:{path:"additionalDetails"}})
        .populate("category")
        .populate({path:"courseContent",populate:{path:"SubSection"}}).exec()
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