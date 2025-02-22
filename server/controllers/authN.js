const User=require("../models/User")
const OTP=require("../models/OTP")
const otpGenerator=require("otp-generator")
const bcrypt=require("bcrypt")
const Profile = require("../models/Profile")
const jwt=require("jsonwebtoken")
const passwordChangedMail=require("../mail/templates/passwordUpdate").passwordUpdated
const mailSender=require("../utils/mailsender")


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

		// Validate required fields
		if (!firstName || !lastName || !email || !password || !confirmPassword || !otp || !accountType) {
			return res.status(403).send({
				success: false,
				message: "All Fields are required",
			});
		}

		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message: "Password and Confirm Password do not match.",
			});
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists. Please sign in to continue.",
			});
		}

		const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
		if (response.length === 0 || otp !== response[0].otp) {
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		let approved = accountType === "Instructor" ? false : true;

		// Create profile before user
		const profileDetails = await Profile.create({
			gender: null,
			dateOfBirth: null,
			about: null,
			contactNumber: contactNumber || null,
		});

		const user = await User.create({
			firstName,
			lastName,
			email,
			contactNumber,
			password: hashedPassword,
			accountType,
			approved,
			additionalDetails: profileDetails._id,
			image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
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
};


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

// Change Password Function
exports.changePassword = async (req, res) => {
    try {
        // Fetching the data
        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        const email = req.user.email;

        // Validation
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all the details",
            });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "New passwords do not match",
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check old password & update the password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid old password",
            });
        }

        // Hash new password and update
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findOneAndUpdate({ email }, { password: hashedPassword });

        // Send email notification
        await mailSender(user.email, "Password Changed", passwordChangedMail(email, "Dear User"));

        // Return success response
        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });

    } catch (error) {
        console.error("Error while changing password:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while resetting password",
        });
    }
};
