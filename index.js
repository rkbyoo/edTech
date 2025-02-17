const express=require("express")
const app=express()



const {connectDb}=require("./config/connectDb")
const {connectCloudinary}=require("./config/cloudinary")
const courseRouter=require("./routes/course")
const paymentRouter=require("./routes/payments")
const profileRouter=require("./routes/profile")
const userRouter=require("./routes/user")
const cookieParser = require("cookie-parser")
const cors=require("cors")
const fileupload=require("express-fileupload")

require("dotenv").config()
PORT=process.env.PORT || 4000

//middlewares
app.use(fileupload({
    useTempFiles:true,
    tempFileDir:"/tmp"
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/v1",courseRouter)
app.use("/api/v1",paymentRouter)
app.use("/api/v1",profileRouter)
app.use("/api/v1",userRouter)

//cors
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))

//database connection
connectDb()
connectCloudinary()



app.listen(PORT,()=>{console.log(`server is running at ${PORT}`)})
app.get("/",async(req,res)=>{
    res.send("this is the home page")
})




