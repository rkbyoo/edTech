const express=require("express")
const router=express.Router()




const {updateProfile,deleteAcccount,getAllUserDetails,updateDisplayPicture}=require("../controllers/profile")
const{resetPasswordToken,resetPasswordWithToken}=require("../controllers/resetPassword")
const{changePassword}=require("../controllers/authN")
const {auth,isStudent}=require("../middlewares/authZ")


//api for user details
router.get("/getUserDetails",auth,getAllUserDetails)
router.put("/updateprofile",auth,updateProfile)
router.delete("/deleteAccount",auth,isStudent,deleteAcccount)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

//reset password
router.post("/resetPasswordToken",resetPasswordToken)
router.post("/resetPassword/:id",resetPasswordWithToken)

//updatepassword
router.put("/updatepassword",auth,changePassword)

module.exports=router