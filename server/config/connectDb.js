const mongoose=require("mongoose")
require("dotenv").config()

exports.connectDb=()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{console.log("database connected successfully")})
    .catch((e)=>{console.log("some error occured while connecting database",e)
        process.exit(1)
    })
}