const mongoose=require("mongoose")
const maileSender = require("../utils/mailsender")
 
const OTPschema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:Number,
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
        const mailResponse=await maileSender(email,"verification email",otp)
        console.log("email sent successfully",mailResponse)
    } catch (error) {
        console.log("some error occured while sending mail",error)
    }
}


//using pre middleware
//this is ref to current object data
OTPschema.pre("save",async function (next) {
    await sendVerificationEmail(this.email,this.otp)
    next()
}) 

module.exports=mongoose.model("OTP",OTPschema)