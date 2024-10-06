import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import { CLOUDINARY_FOLDER_NAME } from "./constants.utilities.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return "No file path provided";
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: CLOUDINARY_FOLDER_NAME
        });
        return response;
    } catch (error) {
        const errorMessage = "Error in uploading file to cloudinary: " + error.message;
        return errorMessage;
    } finally {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        } else {
            console.error("File not found on local server");
        }
    }
}

const deleteFromCloudinary = async (filePathOnCloudinary) => {
    try {
        // Function to extract the public ID from the Cloudinary URL
        function extractPublicId(filePathOnCloudinary) {
            const parts = filePathOnCloudinary.split('/');
            const publicIdWithExtension = parts[parts.length - 1];
            const publicId = publicIdWithExtension.split('.')[0];
            const filePath = CLOUDINARY_FOLDER_NAME + "/" + publicId;
            return filePath;
        }
        // Extract the public ID
        const publicId = extractPublicId(filePathOnCloudinary);
        // Deleting the file using public ID
        const response = cloudinary.api.delete_resources([publicId], {
            resource_type: "auto",
            type: "upload",
        });
        return response;
    } catch (error) {
        const errorMessage = "Error in deleting file from cloudinary" + error.message
        return errorMessage;
    }
}

export { uploadOnCloudinary, deleteFromCloudinary }