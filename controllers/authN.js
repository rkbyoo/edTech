const User=require("../models/User")
const OTP=require("../models/OTP")
const otpGenerator=require("otp-generator")
const bcrypt=require("bcrypt")
const Profile = require("../models/Profile")

//otp generation and sending
exports.sendOTP=async(req,res)=>{
    try {
        const {email}=req.body
    const userExist=await User.findOne({email})
    if(userExist){
        return res.status(403).json({
            success:false,
            message:"user already exists"
        })
    }
    //using otp generator here to generate otps
    let otp=otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    })
    //checking if the generated otp is unique or not
    let OtpExists=await OTP.findOne({otp:otp})
    while(OtpExists)
    {
        otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })
        OtpExists=await OTP.findOne({otp:otp})
    }
    //saving the OTP in the database
    const OtpPayload={email,otp}
    const otpBody=await OTP.create(OtpPayload)
    console.log(otpBody)

    return res.status(200).json({
        success:true,
        message:"OTP sent successfully"
    })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success:false,
            message:"error occured while sending OTP"
        })
    } 
}



//singup
exports.signUp=async(req,res)=>{
 try {
    const {email,firstName,lastName,contactNumber,password,confirmPassword,otp,accountType}=req.body
    //necessary parameter validation
    if(!email || !firstName || !lastName || !password || !confirmPassword || !otp )
    {
        return res.status(403).json({
            success:false,
            message:"all fields are not present"
        })
    }
    //2 password match
    if(password!==confirmPassword){
        return res.status(401).json({
            success:false,
            message:"password didnt matched"
        })
    }
    //user exist or not validaiton
    const userExist=await User.findOne({email})
    if(userExist){
        return res.status(400).json({
            success:false,
            message:"user already exists"
        })
    } 
    //find the recent otp in the schema 
    const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOtp)
    //validate otp here 
    if(recentOtp.length==0){
        //otp not found
        return res.status(400).json({
            success:false,
            message:"OTP found"
        })
    }else if(otp!==recentOtp.otp){
        //invalid otp
        return res.status(400).json({
            success:false,
            message:"Invalid OTP"
        })
    }


    //hash passwords
    const hashedPassword=bcrypt.hash(10,password)

    //saving the user in DB
    const profileDetails=await Profile.create({
        gender:null,
        dob:null,
        about:null,
        contactNumber:null
    })
    const user=await User.create(
        {   
            email,
            firstName,
            lastName,
            password:hashedPassword,
            accountType,
            additonalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
            ,contactNumber
        })

    return res .status(200).json({
        success:false,
        message:"User Created successfully",
        user
    })
 } catch (error) {
    console.log(error)
    res.status(500).json({
        success:false,
        message:"some error occured while signup"
    })
 }

}

//login 
exports.login=async(req,res)=>{
    try {
        //get data from req ki body 
        //validation for data
        //user check karo 
        //generate jwt,after matching password
        //create cookie and send response
    } catch (error) {
        
    }
}

//change password