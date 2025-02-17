const mongoose=require("mongoose")
const maileSender = require("../utils/mailsender")
const otpTemplate=require("../mail/templates/emailVerificationTemplate")
const OTPschema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
        
    }
})

//creating a function to send mails
async function sendVerificationEmail(email,otp) {
    try {
        const mailResponse=await maileSender(email,"verification email",otpTemplate(otp))
        console.log("verification email sent successfully")
    } catch (error) {
        console.log("some error occured while sending verification mail",error)
    }
}


//using pre middleware
//this is reff to current object data that is OTPschema 
OTPschema.pre("save",async function (next) {
    await sendVerificationEmail(this.email,this.otp)
    next()
}) 

module.exports=mongoose.model("OTP",OTPschema)