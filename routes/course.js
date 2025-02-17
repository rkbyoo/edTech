const express=require("express")
const router=express.Router()



const {createCourse,getCourseDetails,showAllCourses,updateCourse,deleteCourse}=require("../controllers/course")
const {createRatingAndReview,getAvgRating,getAllRating,getCourseRating}=require("../controllers/ratingAndReview")
const {createSection,updateSection,deleteSection}=require("../controllers/section")
const {createSubsection,deleteSubSection,updateSubSection}=require("../controllers/subsection")
const {showAllCategory,categoryPageDetails,createCategory}=require("../controllers/category")
const {auth,isStudent,isAdmin,isInstructor}=require("../middlewares/authZ")


//api endpoints of courses
//show all courses
router.get("/showcourses",auth,isStudent,showAllCourses)
//show particular course details
router.get("/getcourse/:id",auth,isInstructor,getCourseDetails)
//create courses
router.post("/createcourses",auth,isInstructor,createCourse)
//update courses 
// router.put("/updatecourses/:id",auth,isInstructor,updateCourse)
//delete courses
// router.post("/deletecourse/:id",auth,isInstructor,deleteCourse)


//api endpoint of categories
//category page details like top selling,others
router.post("/category",categoryPageDetails)
//all category courses
router.get("/allcategory",showAllCategory)
//create new category
router.post("/createCategory",auth,isAdmin,createCategory)

//api endpoint for ratings
router.post("/createRating",auth,isStudent,createRatingAndReview)
router.get("/getAvgRating",getAvgRating)
router.get("/allreview",getAllRating)
router.get("/courseRating",getCourseRating)

//api endpoint for section and subsection
router.post("/createSection",auth,isInstructor,createSection)
router.put("/updatesection",auth,isInstructor,updateSection)
router.delete("/deleteSection",auth,isInstructor,deleteSection)

router.post("createSubSection",auth,isInstructor,createSubsection)
router.put("/updateSubsection",auth,isInstructor,updateSubSection)
router.delete("/deleteSubSection",auth,isInstructor,deleteSubSection)


module.exports=router