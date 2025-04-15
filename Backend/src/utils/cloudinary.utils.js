const cloudinary= require('cloudinary').v2;
const dotenv=require('dotenv');
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage=async (filePath)=>{
    return new Promise((resolve, reject) => {
        console.log("Uploading to Cloudinary:", filePath.slice(0, 30)); // ✅ Log first part of image data
        cloudinary.uploader.upload(filePath, (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                reject(error);
            } else {
                resolve(result.secure_url); // Return the secure URL of the uploaded image
            }
        });
    });
}
module.exports=
    uploadImage
