const Course=require("../models/Course")
const Tag=require("../models/Tag")
const User=require("../models/User")
const {uploadToCloudinary}=require("../utils/imageUploader")

//create course 

exports.createCourse=async(req,res)=>{
    try {
        //data fetch 
        const {courseName,courseDescription,whatYouWillLearn,price,tag}=req.body //here the tag id is in req body
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

        //check given tag is valid or not
        const tagDetails=await Tag.findById({tag})
        if(!tagDetails)
        {
            return res.status(404).json({
                success:false,
                message:"Tag is not found/Invalid"
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
            tag:tagDetails._id,
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

//get all course