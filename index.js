const express=require("express")
const app=express()
const {connectDb}=require("./config/connectDb")
const {connectCloudinary}=require("./config/cloudinary")
const razorpay=require("./config/razorpay")
const router=require("./routes/router")
const cookieParser = require("cookie-parser")
require("dotenv").config()

PORT=process.env.PORT || 4000

app.use(express.json())
app.use(cookieParser.json())
app.listen(PORT,()=>{console.log(`server is running at ${PORT}`)})
app.get("/",async(req,res)=>{
    res.send("this is the home page")
})

app.use("/api",router)
connectDb()
connectCloudinary()




