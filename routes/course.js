const express=require("express")
const router=express.Router()



const {createCourse,getCourseDetails,showAllCourses,updateCourse,deleteCourse}=require("../controllers/course")
const {createRatingAndReview,getAvgRating,getAllRating,getCourseRating}=require("../controllers/ratingAndReview")
const {createSection,updateSection,deleteSection}=require("../controllers/section")
const {createSubSection,deleteSubSection,updateSubSection}=require("../controllers/subsection")
const {showAllCategory,categoryPageDetails,createCategory}=require("../controllers/category")
const {auth,isStudent,isAdmin,isInstructor}=require("../middlewares/authZ")


//api endpoints of courses
//show all courses
router.get("/showCourses",auth,isStudent,showAllCourses)
//show particular course details
router.get("/getCourse/:id",auth,isInstructor,getCourseDetails)
//create courses
router.post("/createCourse",auth,isInstructor,createCourse)
//update courses 
// router.put("/updatecourses/:id",auth,isInstructor,updateCourse)
//delete courses
// router.post("/deletecourse/:id",auth,isInstructor,deleteCourse)


//api endpoint of categories
//category page details like top selling,others
router.get("/categoryPageDetails",categoryPageDetails)
//all category courses
router.get("/getAllCategory",showAllCategory)
//create new category
router.post("/createCategory",auth,isAdmin,createCategory)



//api endpoint for ratings
router.post("/createRating",auth,isStudent,createRatingAndReview)
router.get("/getAvgRating",getAvgRating)
router.get("/allReview",getAllRating)
router.get("/courseRating",getCourseRating)



//api endpoint for section and subsection
router.post("/createSection",auth,isInstructor,createSection)
router.put("/updateSection",auth,isInstructor,updateSection)
router.delete("/deleteSection/:id",auth,isInstructor,deleteSection)

router.post("/createSubSection",auth,isInstructor,createSubSection)
router.put("/updateSubSection",auth,isInstructor,updateSubSection)
router.delete("/deleteSubSection",auth,isInstructor,deleteSubSection)


module.exports=router