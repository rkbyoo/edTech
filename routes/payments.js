const express=require("express")
const router=express.Router()



const {capturePayment,verifySignature}=require("../controllers/payments")
const {auth,isStudent}=require("../middlewares/authZ")

//api for payments
router.post("/capturePayment",auth,isStudent,capturePayment)
router.post("/verifyPayment",verifySignature)


module.exports=router