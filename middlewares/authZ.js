require("dotenv").config()
const jwt=require("jsonwebtoken")
const User=require("../models/User")



//auth 
exports.auth=async(req,res,next)=>{
    try {
        //extract token 
        const token=req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer","");
        //validation 
        if(!token){
            return res.status(401).json({
                success:false,
                message:"token is missing"
            })
        }

        //verify the token 
        try {
            const decode=jwt.verify(token,process.env.JWT_SECRET)
            console.log(decode)
            req.user=decode
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            })
        }
        next()


    } catch (error) {
        console.error("error in auth",error)
        res.status(401).json({
            success:false,
            message:"some error occured while validating the token"
        })
    }
}
//isStudent


exports.isStudent=async(req,res)=>{
    try {
        if(req.user.accountType!=="Student"){
            return res.status(401).json({
                success:false,
                message:"this is the protected route for student only"
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"user role cannot be found"
        })
    }
}

//isInstructor
exports.isInstructor=async(req,res,next)=>{
    try {
        if(req.user.accountType!=="Instructor"){
            return res.status(401).json({
                success:true,
                message:"This is a protected route for instructors only"
            })
        }
        next()
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success:false,
            message:"user role cannot be found"
        })
    }
    
}


//isAdmin
exports.isAdmin=async(req,res,next)=>{
    try {
        if(req.user.accountType!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"this is the protected rourte for admin"
            })
        }
        next()
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success:false,
            message:"user role cannot be found"
        })
    }
    
}