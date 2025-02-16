const express=require("express")
const router=express.Router()
//import all the controllers 
const {signUp,changePassword,login,sendOTP}=require("../controllers/authN")
const {resetPasswordToken,resetPasswordWithToken}=require("../controllers/resetPassword")
const {mailUserAndAdmin}=require("../controllers/contactus")



const {auth}=require("../middlewares/authZ")

//map the router with the controllers


//api endpoints of authN
router.post("/auth/signup",signUp)
router.post("/auth/login",auth,login)
router.post("/auth/verify-otp",sendOTP)
router.post("/auth/forget-password",resetPasswordToken)
router.put("/auth/change-password",auth,changePassword)




//api endpoint of contact us
router.post("/contact",mailUserAndAdmin)



exports.module=router