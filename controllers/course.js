const Course=require("../models/Course")
const Tag=require("../models/Tag")
const User=require("../models/User")
const {uploadToCloudinary}=require("../utils/imageUploader")

//create course 

exports.createCourse=async(req,res)=>{
    try {
        //data fetch 
        const {courseName,courseDescription,whatYouWillLearn,price,tag}=req.body
        //get thumbnail
        const thumbnail=req.files.thumbnailImage
        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
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


    } catch (error) {
        
    }
}

//get all course