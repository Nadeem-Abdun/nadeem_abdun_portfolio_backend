import Experience from "../models/experience.models.js";
import Profile from "../models/profile.models.js";
import asyncHandler from "../utilities/AsyncHandler.utilities.js";
import ApiResponse from "../utilities/ApiResponse.utilities.js";
import ApiError from "../utilities/ApiError.utilities.js";

const createExperience = asyncHandler(async (req, res) => {
    const { profileId } = req.params;
    const { joiningDate, relievingDate, jobTitle, organizationName, responsibilities, skillsInvolved } = req.body;
    if (!profileId) { throw new ApiError(400, "Profile Id is required, Please provide profile id to continue.") }
    if (!joiningDate) { throw new ApiError(400, "Joining Date is required, Please provide joining date to continue.") }
    if (!jobTitle) { throw new ApiError(400, "Job Title is required, Please provide job title to continue.") }
    if (!organizationName) { throw new ApiError(400, "Organization Name is required, Please provide organization name to continue.") }
    if (responsibilities.length < 1) { throw new ApiError(400, "Responsibilities is required, Please provide responsibilities to continue.") }
    if (skillsInvolved.length < 1) { throw new ApiError(400, "Skills Involved is required, Please provide skills involved to continue.") }
    const payload = await Experience.create({
        profileId: profileId,
        joiningDate: joiningDate,
        relievingDate: relievingDate,
        jobTitle: jobTitle,
        organizationName: organizationName,
        responsibilities: responsibilities,
        skillsInvolved: skillsInvolved,
    });
    if (!payload) { throw new ApiError(500, "Error in creating the experience, Please try again.") }
    const updateProfile = await Profile.findByIdAndUpdate(profileId, { $push: { listOfExperiences: payload._id } }, { new: true });
    if (!updateProfile) { throw new ApiError(500, "Error in updating the profile with experience id, Please try again.") }
    return res
        .status(201)
        .json(new ApiResponse(201, "Experience created successfully.", payload));
});

const updateExperience = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { joiningDate, relievingDate, jobTitle, organizationName, responsibilities, skillsInvolved } = req.body;
    if (!id) { throw new ApiError(400, "Experience Id is required, Please provide experience id to continue.") }
    const payload = await Experience.findByIdAndUpdate(id, {
        joiningDate: joiningDate,
        relievingDate: relievingDate,
        jobTitle: jobTitle,
        organizationName: organizationName,
        responsibilities: responsibilities,
        skillsInvolved: skillsInvolved,
    }, { new: true });
    if (!payload) { throw new ApiError(500, "Error in updating the experience, Please try again.") }
    return res
        .status(200)
        .json(new ApiResponse(200, "Experience updated successfully.", payload));
});

const deleteExperience = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) { throw new ApiError(400, "Experience Id is required, Please provide experience id to continue.") }
    const payload = await Experience.findByIdAndDelete(id);
    if (!payload) { throw new ApiError(500, "Error in deleting the experience, Please try again.") }
    const updateProfile = await Profile.findByIdAndUpdate(payload.profileId, { $pull: { listOfExperiences: payload._id } }, { new: true });
    if (!updateProfile) { throw new ApiError(500, "Error in updating the profile with experience id, Please try again.") }
    return res
        .status(200)
        .json(new ApiResponse(200, "Experience deleted successfully.", payload));
});

const getExperience = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) { throw new ApiError(400, "Experience Id is required, Please provide experience id to continue.") }
    const payload = await Experience.findById(id);
    if (!payload) { throw new ApiError(500, "Error in fetching the experience, Please try again.") }
    return res
        .status(200)
        .json(new ApiResponse(200, "Experience fetched successfully.", payload));
});

export { createExperience, updateExperience, deleteExperience, getExperience }