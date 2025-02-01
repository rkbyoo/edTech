const User=require("../models/User")
const OTP=require("../models/OTP")
const otpGenerator=require("otp-generator")
const bcrypt=require("bcrypt")

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
    const {email,firstName,lastName,phoneNumber,password,confirmPassword,otp,accountType}=req.body
    //necessary parameter validation
    if(!email || !firstName || !lastName || !password || !confirmPassword || !otp )
    {
        return res.status(403).json({
            success:false,
            message:"all fields are not present"
        })
    }
    //passowrd validation
    if(password!==confirmPassword){
        return res.status(401).json({
            success:false,
            message:"password didnt matched"
        })
    }
    //user validation
    const userExist=await User.findOne({email})
    if(userExist){
        return res.status(400).json({
            success:false,
            message:"user already exists"
        })
    } 
    //







    //hash passwords
    const hashedPassword=bcrypt.hash(10,password)

    //saving the user in DB
    const response=await User.create({email})

}

//login 

//change password