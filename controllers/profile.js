const Profile=require("../models/Profile")
const User=require("../models/User")
const Course=require("../models/Course")
const {uploadToCloudinary}=require("../utils/imageUploader")
const bcrypt=require("bcrypt")

//update profle because we already created it with null values

exports.updateProfile=async(req,res)=>{
    try {
         //get the profile id and other details
     const {gender,dateOfBirth="",about="",contactNumber}=req.body
     const userId=req.user.id  //i got it from authZ middleware where i have pushed my user details as payload

     //using userid i got the profile id
     const user=await User.findById(userId)
     const profileId=user.additionalDetails
     
     console.log("this is profile id:",profileId)
     //validate
     if(!gender || !dateOfBirth || !about || !contactNumber || !profileId){
        return res.status(404).json({
            success:false,
            message:"missing required fields"
        })
     }
     //update profile 
     const updatedProfileDetails=await Profile.findByIdAndUpdate(profileId,{gender,dateOfBirth,about,contactNumber},{new:true})
     //return res
     return res.status(200).json({
        success:true,
        message:"profile is updated successfully",
        data:updatedProfileDetails
     })
    } catch (error) {
      console.error("error in profile detail updation",error)
        return res.status(500).json({
            success:false,
            message:"internal server error while updating profile"
        })
    }
    
}


//delete account
exports.deleteAcccount = async (req, res) => {
    try {
        // Get the required details to delete the account
        const { password, confirmPassword } = req.body;
        const userId = req.user.id;

        // Validation
        if (!password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, userExists.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }

        // Unenroll user from courses
        await Course.updateMany(
            { _id: { $in: userExists.courses } },
            { $pull: { studentEnrolled: userId } }
        );

        // Delete profile and user
        await Profile.findByIdAndDelete(userExists.additionalDetails);
        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: "Deleted the account successfully",
        });

    } catch (error) {
        console.error("Error while deleting account:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting account",
        });
    }
};



//get all userDetails
exports.getAllUserDetails=async(req,res)=>{
    try {
    //get required user id
    const userId=req.user.id
    //validation ,find the user details from db
    const userDetails=await User.findById(userId).populate("additionalDetails").exec()
    if(!userDetails){
        return res.status(404).json({
            success:false,
            message:"user not found in the database"
            
        })
    }
    //return res
    return res.status(200).json({
        success:true,
        message:"All user details fetched successfully",
        data:userDetails
    })
    } catch (error) {
        console.error("some error while getting user details",error)
        return res.status(500).json({
            success:false,
            message:"internal server error while getting all details"
        })
    }
    
}


exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.status(200).json({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
        console.error("error in updating pfp:",error)
      return res.status(500).json({
        success: false,
        message:"some error in updating profile picture",
      })
    }
};
  
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      },{courses:true})
        .populate("courses")
        .exec()
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
