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


 //get all category

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

 //category page details

 exports.categoryPageDetails=async(req,res)=>{
    try {
        //get category id
        const {categoryId}=req.body
        //get course of specified category course 
        const selectedCategory=await Category.findById(categoryId).populate("courses").exec()
        //validation if no such category found
        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"data not found"
            })
        }
        //get different category course
        const differentCategory=await Category.find({_id:{$ne:categoryId}}).populate("courses").exec()
        if(!differentCategory){
            return res.status(404).json({
                message:"data not found"
            })
        }
        //get top selling category course
        
        //return res 
        return res.status(200).json({
            success:true,
            message:"Course page details",
            selectedCategory:selectedCategory,
            differentCategory:differentCategory
        })
    } catch (error) {
        
    }
 }