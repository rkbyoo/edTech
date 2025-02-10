const Profile=require("../models/Profile")
const User=require("../models/User")
const Course=require("../models/Course")

//update profle because we already created it with null values

exports.updateProfile=async(req,res)=>{
    try {
         //get the profile id and other details
     const {gender,dateOfBirth="",about="",contactNumber}=req.body
     const userId=req.user.id  //i got it from authZ middleware where i have pushed my user details as payload

     //using userid i got the profile id
     const user=await User.findById({userId})
     const profileId=user.additionalDetails
     //validate
     if(!gender || dateOfBirth || !about || !contactNumber || !profileId){
        return res.status(404).json({
            success:false,
            message:"missing required fields"
        })
     }
     //update profile 
     const updatedProfileDetails=await Profile.findByIdAndUpdate({profileId},{gender,dateOfBirth,about,contactNumber},{new:true})
     //return res
     return res.status(200).json({
        success:true,
        message:"profile is updated successfully",
        data:updatedProfileDetails
     })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"internal server error while updating profile"
        })
    }
    
}


//delete account
exports.deleteAcccount=async(req,res)=>{
    try {
     //get the required details to delete account 
    const {password,confirmPassword}=req.body
    const userId=req.user.id
    //validation
    if(!password || !confirmPassword){
        return res.status(404).json({
            success:false,
            message:"required fields are missing"
        })
    }
    if(password!==confirmPassword){
        return res.status(401).json({
            success:false,
            message:"password didnt matched"
        })
    }
    const userExists=await User.findById({userId})
    if(!userExists){
        return res.status(404).json({
            success:false,
            message:"user not found"
        })
    }
    //check password and then delete 
    if(userExists.password!==password){
        return res.status(402).json({
            success:false,
            message:"password is not correct"
        })
    }

    //update the course schema by unenrolling the students
    await Course.findByIdAndUpdate({_id:userExists.courses},{$pull:{studentEnrolled:userId}})

    //delete profile and delete user
    await Profile.findByIdAndDelete({_id:userExists.additionalDetails})
    await User.findByIdAndDelete({userId})
    //return res
    return res.status(200).json({
        success:true,
        message:"deleted the account successfully"
    })
    } catch (error) {
        console.error("some error while deleting account",error)
        return res.status(500).json({
            success:true,
            message:"internal server error while deleting account"
        }) 
    }


}


//get all userDetails
exports.getAllUserDetails=async(req,res)=>{
    try {
    //get required user id
    const userId=req.user.id
    //validation ,find the user details from db
    const userDetails=await User.findById({userId})
    if(!userDetails){
        return res.status(404).json({
            success:false,
            message:"user not found in the database"
        })
    }
    //return res
    return res.status(200).json({
        success:true,
        message:"All user details fetched successfully"
    })
    } catch (error) {
        console.error("some error while getting user details",error)
        return res.status(500).json({
            success:false,
            message:"internal server error while getting all details"
        })
    }
    
}