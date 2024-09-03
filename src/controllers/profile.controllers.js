import User from "../models/user.models.js";
import Profile from "../models/profile.models.js";
import asyncHandler from "../utilities/AsyncHandler.utilities.js";
import ApiResponse from "../utilities/ApiResponse.utilities.js";
import ApiError from "../utilities/ApiError.utilities.js";
import { uploadOnCloudinary } from "../utilities/Cloudinary.utilities.js";

const createProfile = asyncHandler(async (req, res) => {
    const loggedInUser = req.user;
    const { fullName, introducingLine, primaryDescription, secondaryDescription, githubUrl, linkedInUrl, discordUrl, twitterUrl, mailToId } = req.body;
    let { professionalRoles } = req.body;
    if (!fullName) { throw new ApiError(400, "Full Name is required"); }    
    if (!introducingLine) { throw new ApiError(400, "Introductory Line is required"); }
    if (!primaryDescription) { throw new ApiError(400, "Primary Profile Description is required"); }
    if (!secondaryDescription) { throw new ApiError(400, "Secondary Profile Description is required"); }
    if (professionalRoles) { professionalRoles = JSON.parse(professionalRoles); }
    if (professionalRoles.length <= 0) { throw new ApiError(400, "Atleast one Professional Role is required") }
    const profilePic = req.file;
    const profilePicLocalPath = profilePic?.path;
    let uploadProfilePic;
    if (profilePicLocalPath) {
        uploadProfilePic = await uploadOnCloudinary(profilePicLocalPath);
    } else {
        throw new ApiError(500, "Error in uploading profile picture file to server or not provided, Please try again");
    }
    if (!uploadProfilePic || !uploadProfilePic.url) {
        throw new ApiError(400, "Error in uploading the profile picture to cloudinary, Please try again.");
    }
    const payload = await Profile.create({
        fullName: fullName,
        professionalRoles: professionalRoles,
        introducingLine: introducingLine,
        profilePicture: uploadProfilePic?.url,
        primaryDescription: primaryDescription,
        secondaryDescription: secondaryDescription,
        githubUrl: githubUrl,
        linkedInUrl: linkedInUrl,
        discordUrl: discordUrl,
        twitterUrl: twitterUrl,
        mailToId: mailToId,
        listOfExperiences: [],
        listOfWallOfCodeSkills: [],
        listOfProjects: [],
        listOfPersonsContacted: [],
    });
    if (!payload) {
        throw new ApiError(500, "Error in creating the Profile, Please try again.")
    }
    const createdProfileId = payload._id;
    const updateUser = await User.findByIdAndUpdate(loggedInUser._id, { $push: { profile: createdProfileId } }, { new: true });
    if (!updateUser) {
        throw new ApiError(500, "Error in updating the User with Profile Id, Please try again.");
    }
    return res
        .status(201)
        .json(new ApiResponse(201, "Profile created successfully", payload));
});

const updateProfile = asyncHandler(async (req, res) => {
    const { profileId } = req.params;
    const { fullName, professionalRoles, introducingLine, primaryDescription, secondaryDescription, githubUrl, linkedInUrl, discordUrl, twitterUrl, mailToId } = req.body;
    if (!profileId) {
        throw new ApiError(400, "Profile id is not available, Please try again");
    }
    const profileDetails = await Profile.findById(profileId);
    const existingProfilePicture = profileDetails?.profilePicture;
    const profilePic = req.file;
    const profilePicLocalPath = profilePic?.path;
    let uploadProfilePic;
    if (profilePicLocalPath) {
        uploadProfilePic = await uploadOnCloudinary(profilePicLocalPath);
    }
    if ((profilePicLocalPath) && (!uploadProfilePic || !uploadProfilePic.url)) {
        throw new ApiError(400, "Error in uploading the profile picture to cloudinary, Please try again.");
    } else {
        if (existingProfilePicture) {
            await deleteFromCloudinary(existingProfilePicture);
            console.info("Deleted existing profile picture from cloudinary.");
        } else {
            console.info("No existing profile picture found in cloudinary.");
        }
    }
    const payload = await Profile.findByIdAndUpdate(profileId, {
        $set: {
            fullName: fullName,
            professionalRoles: professionalRoles,
            introducingLine: introducingLine,
            profilePicture: uploadProfilePic?.url,
            primaryDescription: primaryDescription,
            secondaryDescription: secondaryDescription,
            githubUrl: githubUrl,
            linkedInUrl: linkedInUrl,
            discordUrl: discordUrl,
            twitterUrl: twitterUrl,
            mailToId: mailToId,
        }
    }, { new: true });
    if (!payload) {
        throw new ApiError(500, "Error in updating the Profile, Please try again.");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Profile updated successfully", payload));
});

const deleteProfile = asyncHandler(async (req, res) => {
    const loggedInUser = req.user;
    const { profileId } = req.params;
    if (!profileId) {
        throw new ApiError(400, "Profile id is not available, Please try again");
    }
    const checkProfileExists = await Profile.findById(profileId);
    if (!checkProfileExists) {
        throw new ApiError(404, "Profile not found with the given id, Please try again.");
    }
    const payload = await Profile.findByIdAndDelete(profileId);
    if (!payload) {
        throw new ApiError(500, "Error in deleting the Profile with the given id, Please try again");
    }
    const updateUser = await User.findByIdAndUpdate(loggedInUser._id, { $pull: { profile: profileId } }, { new: true });
    if (!updateUser) {
        throw new ApiError(500, "Error in updating the User with deleted Profile Id, Please try again.");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Profile deleted successfully", payload));
});

const getProfile = asyncHandler(async (req, res) => {
    const { profileId } = req.params;
    if (!profileId) {
        throw new ApiError(400, "Profile id is not available, Please try again");
    }
    const payload = await Profile.findById(profileId);
    if (!payload) {
        throw new ApiError(404, "Profile not found with the given id, Please try again.");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Profile fetched successfully", payload));
});

export { createProfile, updateProfile, deleteProfile, getProfile }