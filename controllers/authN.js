const User=require("../models/User")
const OTP=require("../models/OTP")
const otpGenerator=require("otp-generator")
const bcrypt=require("bcrypt")
const Profile = require("../models/Profile")
const jwt=require("jsonwebtoken")
const passwordChangedMail=require("../mail/templates/passwordUpdate")
const otpTemplate=require("../mail/templates/emailVerificationTemplate")


require("dotenv").config()
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
        message:"OTP sent successfully",
        otp:otp
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
exports.signUp = async (req, res) => {
	try {
		// Destructure fields from the request body
		const {
			firstName,
			lastName,
			email,
			password,
			confirmPassword,
			accountType,
			contactNumber,
			otp,
		} = req.body;
		// Check if All Details are there or not
		if (
			!firstName ||
			!lastName ||
			!email ||
			!password ||
			!confirmPassword ||
			!otp
		) {
			return res.status(403).send({
				success: false,
				message: "All Fields are required",
			});
		}
		// Check if password and confirm password match
		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message:
					"Password and Confirm Password do not match. Please try again.",
			});
		}

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists. Please sign in to continue.",
			});
		}

		// Find the most recent OTP for the email
		const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
		console.log(response);
		if (response.length === 0) {
			// OTP not found for the email
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		} else if (otp !== response[0].otp) {
			// Invalid OTP
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create the user
		let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);

		// Create the Additional Profile For User
		const profileDetails = await Profile.create({
			gender: null,
			dateOfBirth: null,
			about: null,
			contactNumber: null,
		});
		const user = await User.create({
			firstName,
			lastName,
			email,
			contactNumber,
			password: hashedPassword,
			accountType: accountType,
			approved: approved,
			additionalDetails: profileDetails._id,
			image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
		});

		return res.status(200).json({
			success: true,
			user,
			message: "User registered successfully",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "User cannot be registered. Please try again.",
		});
	}
}

//login 
exports.login=async(req,res)=>{
    try {
        //get data from req ki body 
        const {email,password}=req.body
        //validation for data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"all fields are required"
            }) 
        }
        //user check karo 
        const user=await User.findOne({email})
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user is not registered,please try again"
            })
        }
        //generate jwt,after matching password
         if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType
            }
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            })
            user.token=token
            user.password=undefined
            // creating a cookie and sending the token inside it 
            const options={
                expires:new Date(Date.now()+ 3*24*60*60*1000),
                httpOnly:true
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"logged in successfully"
            })
         }
         else{
            return res.status(401).json({
                success:false,
                message:"password is incorrect"
            })
         }
        
        //create cookie and send response
    } catch (error) {
        console.log("some error occured while login",error)
        return res.status(500).json({
            success:false,
            message:"Login Failure,please try again"
        })

    }
}

//change password
exports.changePassword=async(req,res)=>{
    try {
          //fetching the data
    const {oldPassword,newPassword,confirmNewPassword,email}=req.body
    //validation
    if(!oldPassword || !newPassword || !confirmNewPassword){
        return res.status(401).json({
            success:false,
            message:"Please fill Up the details"
        })
    }
    if(newPassword!==confirmNewPassword){
        return res.status(300).json({
            success:false,
            message:"password doesnt matched"
        })
    }
    const user=await User.findOne({email})
    if(!user){
        return res.status(200).json({
            success:false,
            message:"user not found"
        })
    }
    //check old password & updating the password
    if(await bcrypt.compare(oldPassword,user.password)){
        await User.findOneAndUpdate({email},{password:newPassword})
        const body="Your Password is successfully changed,please make sure its you"
        await maileSender(user.email,"Password Changed",passwordChangedMail)

    }
    else{
        return res.status(401).json({
            success:false,
            message:"Invalid old Password"
        })
    }
    }
     catch (error) {
        console.error("some error occured while changing password")
        res.status(500).json({
            success:false,
            message:"internal server error while reseting password"
        })
    }
}