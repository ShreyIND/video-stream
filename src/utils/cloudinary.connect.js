import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const uploadCloudinary=async (filePath)=>{
    if(!filePath){
        return null;
    }
    try{
        const result=await cloudinary.uploader.upload(filePath,{
            resource_type:'auto',
            folder:'video-sharing-app'
        });
        console.log("Cloudinary upload result",result);
        fs.unlinkSync(filePath); 
        return result;
    }
    catch(error){
        fs.unlinkSync(filePath); // Delete the file if upload fails
        return null;
    }
}


export  {uploadCloudinary};