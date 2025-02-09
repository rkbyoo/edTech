const Subsection=require("../models/SubSection")
const Section=require("../models/Section")
const { uploadToCloudinary } = require("../utils/imageUploader")
const Section = require("../models/Section")


//create subsection

exports.createSubsection=async(req,res)=>{
    try {
        //fetch the data
        const {title,timeDuration,description,sectionId}=req.body
        const {videoFile}=req.files
        //data validation
        if(!videoFile||!title||!timeDuration||!description || !sectionId){
            return res.status(404).json({
                success:false,
                message:"please fill up all the required field"
            })
        }
        //create subsection and uplaod to cloudinary
        const videoUpload=await uploadToCloudinary(videoFile,process.env.VIDEO_FOLDER)
        const createSubSection=await Subsection.create({title,timeDuration,description,videoUrl:videoUpload.secure_url})
        //update section schema
        const updateSectionDetails=await Section.findByIdAndUpdate({sectionId},{$push:{SubSection:createSubSection._id}},{new:true}).populate("SubSection").exec()
        
        //return res
        return res.status(200).json({
            success:true,
            message:"sub section created successfully",
            data:updateSectionDetails
        })

    } catch (error) {
        console.error("some error while creating subsection",error)
        return res.status(500).json({
            success:false,
            message:"some internal server error while creating subsection"
        })
    }
}

//update subsection

//delete subsection