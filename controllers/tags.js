const Tag=require('../models/Tag')
 //cretae tag ka handler function in which admin will be able to crete tags

 exports.createTag=async(req,res)=>{
    try {
        const{name,description}=req.body
        if(!name || !description){
            return res.status(401).json({
                success:false,
                message:"Please fill up all the required fields"
            })
        }
        const tagDetails= await Tag.create({name:name,description:description})
        console.log(tagDetails)
        return res.status(200).json({
            success:true,
            message:"Tags created successfully"
        })
    } catch (error) {
        console.error("some error occured while creating tags",error)
        res.status(500).json({
            success:false,
            message:"internal error while creating tags"
        })
    }
 }


 //get all tags 

 exports.showAllTags=async(req,res)=>{
    try {
        const allTags=await Tag.find({},{name:true,description:true})
        return res.status(200).json({
            success:true,
            message:"All tags are returned successfully",
            data:allTags
        })

    } catch (error) {
        console.error("some error occured while getting tags",error)
        res.status(500).json({
            success:false,
            message:"internal error while getting tags"
        })
    }
 }