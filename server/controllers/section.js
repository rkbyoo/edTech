const Section=require("../models/Section")
const Course=require("../models/Course")


//creating section 
exports.createSection=async(req,res)=>{
 
    try {
           //fetch data
    const {sectionName,courseId}=req.body
    //data validation
    if(!sectionName || !courseId){
        return res.status(404).json({
            success:false,
            message:"Please fill up all the required field"
        })
    }
    //create section
    const newSection=await Section.create({sectionName})
    //update course schema by pushing section id
    const updateCourseDetails=await Course.findByIdAndUpdate(courseId,{$push:{courseContent:newSection._id}},{new:true}).populate({path:"courseContent"}).exec()
    //return res
    return res.status(200).json({
        success:true,
        message:"Section is created successfully",
        data:updateCourseDetails
    })
    } catch (error) {
        console.error("some error while creating section",error)
        return res.status(500).json({
            success:false,
            message:"Internal server error while creating sections"
        })
    }
}

//update section

exports.updateSection=async(req,res)=>{
    try {
        //data input
        const {sectionName,sectionId}=req.body
        //data validation
        if(!sectionName || !sectionId){
            return res.status(404).json({
                success:false,
                message:"missing fields"
            })
        }
        //data update
        const updateSectionDetails=await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true})
        //return res
        return res.status(200).json({
            success:true,
            message:"section updated successfully",
            data:updateSectionDetails
        })
    } catch (error) {
        console.error("some error while updating section",error)
        return res.status(500).json({
            success:false,
            message:"Internal server error while updating sections"
        })
    }
}
//deleting the section
exports.deleteSection=async(req,res)=>{
    try {
        //data fetch sirf id
        const {sectionId,courseId}=req.body
        //data validation\
        if(!sectionId || !courseId){
            return res.status(404).json({
                success:false,
                message:"unable to find the id"
            })
        }
        //validate course and section id
        if(!Section.findById(sectionId) || !Course.findById(courseId) ){
            return res.status(404).json({
                success:true,
                message:"unable to find the course or section u want to delete"
            })
        }
        //update course (mandatory or  not) TODO while testing
        const updatedCourseDetails=await Course.findByIdAndUpdate(courseId,{$pull:{courseContent:sectionId}},{new:true})
        //delete
        await Section.findByIdAndDelete(sectionId,{new:true})
        
        //return res
        return res.status(200).json({
            success:true,
            message:"section is deleted successfully",
            data:updatedCourseDetails
        })
    } catch (error) {
        console.error("some error while deletingsection",error)
        return res.status(500).json({
            success:false,
            message:"Internal server error while deleting sections"
        })
    }
}