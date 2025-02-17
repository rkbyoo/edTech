const express=require("express")
const router=express.Router()
//import all the controllers 
const {signUp,changePassword,login,sendOTP}=require("../controllers/authN")
const {resetPasswordToken,resetPasswordWithToken}=require("../controllers/resetPassword")
const {mailUserAndAdmin}=require("../controllers/contactus")



const {auth}=require("../middlewares/authZ")

//map the router with the controllers


//api endpoints of authN
router.post("/signup",signUp)
router.post("/login",login)
router.post("/sendotp",sendOTP)
router.post("/forget-password",resetPasswordToken)
router.put("/change-password",auth,changePassword)




//api endpoint of contact us
router.post("/contact",mailUserAndAdmin)



module.exports=router