const Category=require('../models/Category')
 //cretae category ka handler function in which admin will be able to crete tags

 exports.createCategory=async(req,res)=>{
    try {
        const{name,description}=req.body
        if(!name || !description){
            return res.status(401).json({
                success:false,
                message:"Please fill up all the required fields"
            })
        }
        const categoryDetails= await Category.create({name:name,description:description})
        console.log(categoryDetails)
        return res.status(200).json({
            success:true,
            message:"category created successfully"
        })
    } catch (error) {
        console.error("some error occured while creating category",error)
        res.status(500).json({
            success:false,
            message:"internal error while creating category"
        })
    }
 }


 //get all tags 

 exports.showAllCategory=async(req,res)=>{
    try {
        const allCategory=await Category.find({},{name:true,description:true})
        return res.status(200).json({
            success:true,
            message:"All categories are returned successfully",
            data:allCategory
        })

    } catch (error) {
        console.error("some error occured while getting tags",error)
        res.status(500).json({
            success:false,
            message:"internal error while getting category"
        })
    }
 }