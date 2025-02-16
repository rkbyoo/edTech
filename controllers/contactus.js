//create handler for contact us
require("dotenv").config()
const maileSender = require("../utils/mailsender")
const responseMailBody=require("../mail/templates/responseSent")
const mailMyself=require("../mail/templates/userResponseMail")

//send mail to user
exports.mailUserAndAdmin=async(req,res)=>{
    try {
        //get the data from the body
    const {firstName,lastName,email,phoneNumber,message}=req.body
    //validate the data
    if(!firstName || !lastName || !email || !phoneNumber || !message){
        return res.status(404).json({
            success:false,
            message:"required data is missing"
        })
    }
    //send a mail to the user and admin
    await maileSender(email,"We Got Your Response",responseMailBody(firstName))
    await maileSender(process.env.adminMailId,"you got a response",mailMyself(firstName,lastName,email,message))
    //return res
    return res.status(200).json({
        success:true,
        message:"mail is sent to user"
    })
    } catch (error) {
        console.error("some error while sending mail for contact us")
        res.status(500).json({
            success:false,
            message:"internal server error while contact us step"
        })
    }
    
}
