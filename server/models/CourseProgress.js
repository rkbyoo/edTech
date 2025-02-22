const mongoose=require("mongoose")
const courseProgress=mongoose.Schema({
    courseId:{
        type:mongoose.Schema.Types.objectId,
        ref:"Course"
    },
    completedVideos:[
        {
            type:mongoose.Schema.Types.objectId,
            ref:"SubSection"
        }
    ]

})

module.exports=mongoose.model("CourseProgress",courseProgress)