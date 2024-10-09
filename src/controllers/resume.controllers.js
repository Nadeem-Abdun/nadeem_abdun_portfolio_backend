import axios from "axios";
import Resume from "../models/resume.models.js";
import asyncHandler from "../utilities/AsyncHandler.utilities.js";
import ApiResponse from "../utilities/ApiResponse.utilities.js";
import ApiError from "../utilities/ApiError.utilities.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utilities/Cloudinary.utilities.js";

const uploadResume = asyncHandler(async (req, res) => {
    const { profileId } = req.params;
    const { resumeStatus } = req.body;
    if (!profileId) { throw new ApiError(400, "Profile Id is required, Please provide profile id to continue.") }
    const resumeFile = req.file;
    const resumeFilePath = resumeFile?.path;
    let uploadedResumeFile;
    if (resumeFilePath) {
        uploadedResumeFile = await uploadOnCloudinary(resumeFilePath);
    } else {
        throw new ApiError(500, "Error in uploading resume file to server or file not provided, Please try again");
    }
    if (!uploadedResumeFile || !uploadedResumeFile.url) {
        throw new ApiError(400, "Error in uploading the resume file to cloudinary, Please try again.");
    }
    const payload = await Resume.create({
        profileId: profileId,
        resumeURL: uploadedResumeFile?.url,
        resumeStatus: resumeStatus
    });
    if (!payload) { throw new ApiError(500, "Error in creating resume doc on the database, Please try again.") }
    return res
        .status(201)
        .json(new ApiResponse(201, "Resume uploaded successfully.", payload));
});

const getAllResumes = asyncHandler(async (req, res) => {
    const { profileId } = req.params;
    if (!profileId) { throw new ApiError(400, "Profile Id is required, Please provide profile id to continue.") }
    const payload = await Resume.find({ profileId: profileId });
    if (!payload) { throw new ApiError(500, "Error in getting all resumes, Please try again.") }
    return res
        .status(200)
        .json(new ApiResponse(200, "All resumes fetched successfully.", payload));
});

const getActiveResume = asyncHandler(async (req, res) => {
    const { profileId } = req.params;
    if (!profileId) { throw new ApiError(400, "Profile Id is required, Please provide profile id to continue.") }
    const payload = await Resume.findOne({ profileId: profileId, resumeStatus: "Active" });
    if (!payload) { throw new ApiError(500, "Error in getting active resume, Please try again.") }
    return res
        .status(200)
        .json(new ApiResponse(200, "Active resume fetched successfully.", payload));
});

const downloadActiveResume = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) { throw new ApiError(400, "Resume Id is required, Please provide resume id to continue.") }
    const payload = await Resume.findById(id);
    if (!payload) { throw new ApiError(500, "Error in getting resume, Please try again.") }
    const resumeURL = payload?.resumeURL;
    if (!resumeURL) { throw new ApiError(500, "Error in getting resume URL, Please try again.") }
    try {
        const response = await axios.get(resumeURL, { responseType: "stream" });
        res.setHeader("Content-Disposition", `attachment; filename=${id}.pdf`);
        res.setHeader("Content-Type", response.headers['content-type']);
        response.data.pipe(res);
    } catch (error) {
        throw new ApiError(500, "Error in fetching resume file. Please try again.");
    }
});

const updateResumeStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { resumeStatus } = req.body;
    if (!id) { throw new ApiError(400, "Resume Id is required, Please provide resume id to continue.") }
    if (!resumeStatus) { throw new ApiError(400, "Resume Status is required, Please provide resume status to continue.") }
    const targetResume = await Resume.findById(id);
    if (!targetResume) { throw new ApiError(404, "Resume not found. Please try again.") }
    if (resumeStatus === "Active") {
        await Resume.updateMany(
            { profileId: targetResume.profileId, _id: { $ne: id } },
            { $set: { resumeStatus: "InActive" } }
        )
    }
    const payload = await Resume.findByIdAndUpdate(id, { resumeStatus: resumeStatus }, { new: true });
    if (!payload) { throw new ApiError(500, "Error in updating resume status, Please try again.") }
    return res
        .status(200)
        .json(new ApiResponse(200, "Resume status updated successfully.", payload));
});

const deleteResume = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) { throw new ApiError(400, "Resume Id is required, Please provide resume id to continue.") }
    const existingResume = await Resume.findById(id);
    if (!existingResume) { throw new ApiError(404, "Resume not found. Please try again.") }
    const resumeURL = existingResume?.resumeURL;
    let deleteResume;
    if (resumeURL) {
        deleteResume = await deleteFromCloudinary(resumeURL);
    }
    if (!deleteResume) {
        throw new ApiError(500, "Error in deleting resume file from cloudinary, Please try again.")
    }
    const payload = await Resume.findByIdAndDelete(id);
    if (!payload) { throw new ApiError(500, "Error in deleting resume, Please try again.") }
    return res
        .status(200)
        .json(new ApiResponse(200, "Resume deleted successfully.", payload));
});

export { uploadResume, getAllResumes, getActiveResume, downloadActiveResume, updateResumeStatus, deleteResume }