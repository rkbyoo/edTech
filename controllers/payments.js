const {instance}=require("../config/razorpay")
const Course=require("../models/Course")
const User=require("../models/User")

const mailSender=require("../utils/mailsender")


const {courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail")
const { default: mongoose } = require("mongoose")


//capture the payment and initiate the razorpay order
exports.capturePayment=async(req,res)=>{
    //get courseId and user Id 
    const {courseId}=req.body;
    const userId=req.user.id
    //validation 
    //valid course id or not
    if(!courseId){
        return res.json({
            success:false,
            message:"please provide the valid course id"
        })
    }

    //valid course details or not 
    let course;
    try{
        course=await Course.findById(courseId)
        if(!course){
            return res.json({
                success:false,
                message:"No such course exists"
            })
        }
           //user already paid for the same course or not 
           const uId= mongoose.Types.ObjectId(userId)
           if(course.studentEnrolled.includes(uId)){
            return res.status(200).json({
                success:false,
                message:"student is already enrolled"
            })
           }
    }
    catch(error){
        console.error("some error in course validation",error)
        res.status(500).json({
            success:false,
            message:"error in validation of course"
        })
    }
 

    //order create 
    const amount=course.price
    const currency="INR"
    const options={
        amount:amount*100,
        currency,
        reciept:Math.random(Date.now()).toString(),
        notes:{
            courseId:courseId,
            userId
        }
    }


    try {
        //initiate the payment using razorpay
        const paymentResponse=await instance.orders.create(options)
        console.log(paymentResponse)
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            orderId:paymentResponse.currency,
            amount:paymentResponse.amount
        })
    } catch (error) {
        console.error("some error in order creation",error)
        res.status(500).json({
            success:false,
            message:"error in creating order"
        })
    }
    //return res

}




//vertification signature of razorpay and server



