const cloudinary = require("cloudinary").v2

exports.uploadToCloudinary = async(file, folder, height, quality) = {
    try {
        const options = { folder }
        if(height) {
            options.height = height
        }
        if(quality){
            options.quality=quality
        }
        if(quality)
    } catch(error) {
        console.error("some error while uploading file to cloudinary")
    }
}