import Profile from "../models/profile.models.js";
import Project from "../models/project.models.js";
import asyncHandler from "../utilities/AsyncHandler.utilities.js";
import ApiResponse from "../utilities/ApiResponse.utilities.js";
import ApiError from "../utilities/ApiError.utilities.js";
import { uploadOnCloudinary } from "../utilities/Cloudinary.utilities.js";

const createProject = asyncHandler(async (req, res) => {
    const { profileId } = req.params;
    const { title, description, skillsInvolved, websiteUrl, repositoryUrl } = req.body;
    if (!profileId) { throw new ApiError(400, "Profile Id is required, Please provide profile id to continue.") }
    if (!title) { throw new ApiError(400, "Project Title is required, Please provide title to continue.") }
    if (!description) { throw new ApiError(400, "Project Description is required, Please provide description to continue.") }
    if (skillsInvolved.length < 1) { throw new ApiError(400, "Skills Involved are required, Please provide skills to continue.") }
    const projectPic = req.file;
    const projectPicLocalPath = projectPic?.path;
    let uploadProjectImage;
    if (projectPicLocalPath) {
        uploadProjectImage = await uploadOnCloudinary(projectPicLocalPath);
    } else {
        throw new ApiError(500, "Error in uploading project picture file to server or not provided, Please try again");
    }
    if (!uploadProjectImage || !uploadProjectImage.url) {
        throw new ApiError(400, "Error in uploading the project picture to cloudinary, Please try again.");
    }
    const payload = await Project.create({
        profileId: profileId,
        projectPicture: uploadProjectImage?.url,
        title: title,
        description: description,
        skillsInvolved: skillsInvolved,
        websiteUrl: websiteUrl,
        repositoryUrl: repositoryUrl,
    });
    if (!payload) { throw new ApiError(500, "Error in creating the project, Please try again.") }
    const updateProfile = await Profile.findByIdAndUpdate(profileId, { $push: { listOfProjects: payload._id } }, { new: true });
    if (!updateProfile) { throw new ApiError(500, "Error in updating the profile, Please try again.") }
    return res
        .status(201)
        .json(new ApiResponse(201, "Project created successfully.", payload));
});

const updateProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, skillsInvolved, websiteUrl, repositoryUrl } = req.body;
    if (!id) { throw new ApiError(400, "Project Id is required, Please provide project id to continue.") }
    if (!title) { throw new ApiError(400, "Project Title is required, Please provide title to continue.") }
    if (!description) { throw new ApiError(400, "Project Description is required, Please provide description to continue.") }
    if (skillsInvolved.length < 1) { throw new ApiError(400, "Skills Involved are required, Please provide skills to continue.") }
    const projectDetails = await Project.findById(id);
    const existingProjectPicture = projectDetails?.projectPicture;
    const projectPic = req.file;
    const projectPicLocalPath = projectPic?.path;
    let uploadProjectImage;
    if (projectPicLocalPath) {
        uploadProjectImage = await uploadOnCloudinary(projectPicLocalPath);
    }
    if ((projectPicLocalPath) && (!uploadProjectImage || !uploadProjectImage.url)) {
        throw new ApiError(400, "Error in uploading the project picture to cloudinary, Please try again.");
    } else {
        if (existingProjectPicture) {
            await deleteFromCloudinary(existingProjectPicture);
            console.info("Deleted existing project picture from cloudinary.");
        } else {
            console.info("No existing project picture found in cloudinary.");
        }
    }
    const payload = await Project.findByIdAndUpdate(id, {
        projectPicture: uploadProjectImage?.url,
        title: title,
        description: description,
        skillsInvolved: skillsInvolved,
        websiteUrl: websiteUrl,
        repositoryUrl: repositoryUrl,
    }, { new: true });
    if (!payload) { throw new ApiError(500, "Error in updating the project, Please try again.") }
    return res
        .status(200)
        .json(new ApiResponse(200, "Project updated successfully.", payload));
});

const deleteProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) { throw new ApiError(400, "Project Id is required, Please provide project id to continue.") }
    const payload = await Project.findByIdAndDelete(id);
    if (!payload) { throw new ApiError(500, "Error in deleting the project, Please try again.") }
    const updateProfile = await Profile.findByIdAndUpdate(payload.profileId, { $pull: { listOfProjects: payload._id } }, { new: true });
    if (!updateProfile) { throw new ApiError(500, "Error in updating the profile, Please try again.") }
    return res
        .status(200)
        .json(new ApiResponse(200, "Project deleted successfully.", payload));
});

const getProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) { throw new ApiError(400, "Project Id is required, Please provide project id to continue.") }
    const payload = await Project.findById(id);
    if (!payload) { throw new ApiError(500, "Error in getting the project, Please try again.") }
    return res
        .status(200)
        .json(new ApiResponse(200, "Project fetched successfully.", payload));
});

export { createProject, updateProject, deleteProject, getProject }