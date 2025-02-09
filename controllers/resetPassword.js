const User=require("../models/User")
const mailSender=require("../utils/mailsender")
const bcrypt=require('bcrypt')


//reset password token ,send the link to reset email ps
exports.resetPasswordToken=async(req,res)=>{
try {
    //get the email from req body
    const email=req.body.email
    //validation on email
    const user=await User.findOne({email:email})
    if(!user){
        return res.json({
            success:false,
            message:"Your email is not registered with us"
        })
    }
    //generate token and expiration time and update it in user module
    const token=crypto.randomUUID();
    const updateDetails=await User.findOneAndUpdate({email},{
        token:token,
        resetPasswordExpires:Date.now()+5*60*1000
    },{new:true})
    //create url
    const url=`http://localhost:3000/update-password/${token}`
    //send mail containing the url 
    await mailSender(email,"Password Link Reset",`Password Reset Link:${url}`)
    //return res
    return res.status(200).json({
        success:true,
        message:"Email sent successfully,please check email to change Password"
    })
} catch (error) {
    console.error(error)
    res.json({
        success:false,
        message:"some error occured while reseting the password"
    })
}
}

//reset password
exports.resetPassword=async(req,res)=>{
   try {
    const {token,newPassword,newConfirmPassword}=req.body
    if(!newPassword || newConfirmPassword || token){
        return res.status(403).json({
            success:false,
            message:"please fillup the password"
        })
    }
    if(newPassword!==newConfirmPassword){
        return res.status(401).json({
            success:false,
            message:"password Didn't matched"
        })
    }
    const userDetails=await User.findOne({token})
   if(!userDetails){
    return res.json({
        success:false,
        message:"token is not valid"
    })
   }
   if(userDetails.resetPasswordExpires < Date.now()){
    return res.status(403).json({
        success:false,
        message:"Invalid Token"
    })
   }
   const hashedPassword=await bcrypt.hash(newPassword,10)
   await User.findOneAndUpdate({token},{password:hashedPassword},{new:true})
   res.status(200).json({
    success:true,
    message:"The password is successfully reset"
   })
   } catch (error) {
    console.error(error)
    res.status(500).json({
        success:false,
        message:"some error occured while dealing with reset password"
    })
   }
}