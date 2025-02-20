const Subsection=require("../models/SubSection")
const Section=require("../models/Section")
const { uploadToCloudinary } = require("../utils/imageUploader")
const { findById } = require("../models/Category")
const SubSection = require("../models/SubSection")


//create subsection

exports.createSubSection=async(req,res)=>{
    try {
        //fetch the data
        const {title,timeDuration,description,sectionId}=req.body
        const videoFile=req.files.videoFile
        //data validation
        if(!await Section.findById(sectionId)){
            return res.status(404).json({
                success:false,
                message:"no such id exists for section"
            })
        }
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
        const updateSectionDetails=await Section.findByIdAndUpdate(sectionId,{$push:{SubSection:createSubSection._id}},{new:true}).populate("SubSection").exec()
        
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
exports.updateSubSection=async(req,res)=>{
    try {
         //data fetch 
    const {subSectionId,title,timeDuration,description}=req.body
    //data validate 
    if(!subSectionId ||!title||!timeDuration||!description){
        return res.status(404).json({
            success:false,
            message:"unable to get required fields"
        })
    }
    const subSection=SubSection.findById(subSectionId)
    if(!subSection){
        return res.status(404).json({
            success:false,
            message:"unable to get the subsection"
        })}
    //data update
    const updatedSubSection=await Subsection.findByIdAndUpdate(subSectionId,{title:title,timeDuration:timeDuration,description:description},{new:true})
    //return res
    return res.status(200).json({
        success:true,
        message:"subsection updated successfully",
        data:updatedSubSection
    })
    } catch (error) {
        console.error("some error while updating subsection",error)
        return res.status(500).json({
            success:false,
            message:"Internal server error while updating the subsection"
        })
    }
   
}


//delete subsection

exports.deleteSubSection=async(req,res)=>{

try {
    //fetch id
const {subSectionId,sectionId}=req.body
//validation
if(!subSectionId || !sectionId){
    return res.status(404).json({
        success:false,
        message:"unable to find the file id"
    })
}
//delete
const deletedSubsection=await SubSection.findByIdAndDelete(subSectionId,{new:true})
//update section schema
const updatedSection=await Section.findByIdAndUpdate(sectionId,{$pull:{SubSection:subSectionId}})
//return res
if(!deletedSubsection || !updatedSection){
    return res.status(404).json({
        success:false,
        message:"no such section and subsection exists"
    })
}

return res.status(200).json({
    success:true,
    message:"successfully deleted the subsection"
})
} catch (error) {
    console.error("some error while deleting subsection",error)
        return res.status(500).json({
            success:false,
            message:"Internal server error while deleting the subsection"
        })
}
}