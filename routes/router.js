const express=require("express")
const router=express.Router()
//import all the controllers 
const {signUp,resetPassword,login,sendOTP}=require("../controllers/authN")
const {resetPasswordToken,resetPasswordWithToken}=require("../controllers/resetPassword")
const {createCourse,getCourseDetails,showAllCourses}=require("../controllers/course")
const {showAllCategory,categoryPageDetails,createCategory}=require("../controllers/category")
const {mailUserAndAdmin}=require("../controllers/contactus")
const {capturePayment,verifySignature}=require("../controllers/payments")
const {updateProfile,deleteAcccount,getAllUserDetails}=require("../controllers/profile")
const {createRatingAndReview,getAvgRating,getAllRating,getCourseRating}=require("../controllers/ratingAndReview")
const {createSection,updateSection,deleteSection}=require("../controllers/section")
const {createSubsection,deleteSubSection,updateSubSection}=require("../controllers/subsection")
const {auth,isStudent,isAdmin,isInstructor}=require("../middlewares/authZ")

//map the router with the controllers



