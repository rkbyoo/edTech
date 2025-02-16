const {instance}=require("../config/razorpay")
const Course=require("../models/Course")
const User=require("../models/User")

const mailSender=require("../utils/mailsender")


const {courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail")
const { default: mongoose } = require("mongoose")
const { default: webhooks } = require("razorpay/dist/types/webhooks")


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
exports.verifySignature=async(req,res)=>{
    //crated a webhook in backend 
    const weebhookSecret="12345678"


    const signature=req.headers["x-razorpay-signature"]

    const shasum=crypto.createHmac("sha256",weebhookSecret) //sha256 is algo for webhook
    shasum.update(JSON.stringify(req.body))
    const digest=shasum.digest("hex");
    if(signature===digest){
        console.log("payment is authorized")

        const {courseId,userId}=req.body.payload.payment.entity.notes

        try {
            //fulfil the action
             
            //find the course and enroll the student in it 
            const  enrolledCourse=await Course.findOneAndUpdate({_id:courseId},{$push:{studentEnrolled:userId}},{new:true})
            if(!enrolledCourse){
                return res.status(404).json({
                    success:false,
                    message:"course not found"
                })
            }
            console.log(enrolledCourse)


            //find the student and update the schema by pushing the course in it 
            const enrolledStudent=await User.findOneAndUpdate({_id:userId},{$push:{courses:courseId}},{new:true})

            //mail send for confirmation 
            const emailResponse=await mailSender(enrolledStudent.email,"Course enrollement","u are successfully enrolled into the course")

            console.log(enrolledStudent)
            return res.status(200).json({
                success:true,
                message:"student verified and enrolled successfully into the course",
            })

        } catch (error) {
           return res.status(500).json({
            success:false,
            message:"some error while enrolment in the course"
           }) 
        }

    }
    else{
        return res.status(500).json({
            success:false,
            message:"payment is unauthorized"
        })
    }
}


