import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();
import fs from 'node:fs';

const uploadOnCloudinary = async (file) => {
    cloudinary.config({
        cloud_name: process.env.cloudinary_cloud_name,
        api_key: process.env.cloudinary_api_key,
        api_secret: process.env.cloudinary_api_secret
    });
    try {
        const result = await cloudinary.uploader.upload(file);
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
        return result.secure_url;
    } catch (err) {
        console.error('Error uploading to Cloudinary:', err);
        throw err;
    }
};

export default uploadOnCloudinary;