import {v2 as cloudinary} from 'cloudinary'
import fs from'fs'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});


const uploadOnCloudinary = async (localFilePath) => {
    console.log("Cloudinary config:", {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    
    try{

        console.log("Inside the uploading function")

        if(!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        //upload file from cloudinary
        console.log("File uploaded on cloudinary", response.url)
        return response
    } catch (error){

        // fs.unlinkSync(localFilePath) //Remove the locally saved temp file
        console.log("Cloudinary upload error")
        return  null

    }
}

export {uploadOnCloudinary}