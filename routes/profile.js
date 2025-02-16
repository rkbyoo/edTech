const express=require("express")
const router=express.Router()




const {updateProfile,deleteAcccount,getAllUserDetails,getEnrolledCourses,updateDisplayPicture}=require("../controllers/profile")



//api for user details
router.get("/allDetails",auth,getAllUserDetails)
router.put("/updateprofile",auth,updateProfile)
router.delete("/deleteAccount",deleteAcccount)


router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)


module.exports=router