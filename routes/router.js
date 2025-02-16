const express=require("express")
const router=express.Router()
//import all the controllers 
const {signUp,resetPassword,login,sendOTP}=require("../controllers/authN")
const {resetPasswordToken,resetPasswordWithToken}=require("../controllers/resetPassword")
const {createCourse,getCourseDetails,showAllCourses,updateCourse,deleteCourse}=require("../controllers/course")
const {showAllCategory,categoryPageDetails,createCategory}=require("../controllers/category")
const {mailUserAndAdmin}=require("../controllers/contactus")
const {capturePayment,verifySignature}=require("../controllers/payments")
const {updateProfile,deleteAcccount,getAllUserDetails}=require("../controllers/profile")
const {createRatingAndReview,getAvgRating,getAllRating,getCourseRating}=require("../controllers/ratingAndReview")
const {createSection,updateSection,deleteSection}=require("../controllers/section")
const {createSubsection,deleteSubSection,updateSubSection}=require("../controllers/subsection")
const {auth,isStudent,isAdmin,isInstructor}=require("../middlewares/authZ")

//map the router with the controllers


//api endpoints of authN
router.post("/auth/signup",signUp)
router.post("/auth/login",auth,login)
router.post("/auth/verify-otp",sendOTP)
router.post("/auth/forget-password",resetPasswordToken)
router.put("/auth/change-password",resetPassword)


//api endpoints of courses
router.get("/courses",auth,isStudent,showAllCourses)
router.get("/courses/:id",auth,isInstructor,getCourseDetails)
router.post("/courses",createCourse)
router.put("/courses/:id",updateCourse)
router.delete("/courses/:id",deleteCourse)

//api endpoint of contact us
router.post("/contact",mailUserAndAdmin)

//api endpoint of categories
router.post("/category",categoryPageDetails)
router.get("/allcategory",showAllCategory)
router.post("/createCategory",createCategory)

//api for payments
router.post("/capturePayment",capturePayment)
router.post("/verifyPayment",verifySignature)

//api for user details
router.get("/allDetails",getAllUserDetails)
router.put("/updateprofile",updateProfile)
router.delete("/deleteAccount",deleteAcccount)

//api endpoint for ratings
router.post("/createRating",createRatingAndReview)
router.get("/getAvgRating",getAvgRating)
router.get("/allreview",getAllRating)
router.get("/courseRating",getCourseRating)

//api endpoint for section and subsection
router.post("/createSection",createSection)
router.put("/updatesection",updateSection)
router.delete("/deleteSection",deleteSection)

router.post("createSubSection",createSubsection)
router.put("/updateSubsection",updateSubSection)
router.delete("/deleteSubSection",deleteSubSection)


