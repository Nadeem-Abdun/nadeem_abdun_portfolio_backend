import Profile from "../models/profile.models.js";
import WallOfCode from "../models/wallOfCode.models.js";
import asyncHandler from "../utilities/AsyncHandler.utilities.js";
import ApiResponse from "../utilities/ApiResponse.utilities.js";
import ApiError from "../utilities/ApiError.utilities.js";

const createSkill = asyncHandler(async (req, res) => {
    const { profileId } = req.params;
    const { skillName, skillIcon } = req.body;
    if (!profileId) { throw new ApiError(400, "Profile Id is required, Please provide profile id to continue.") }
    if (!skillName) { throw new ApiError(400, "Skill Name is required, Please provide skill name to continue.") }
    if (!skillIcon) { throw new ApiError(400, "Skill Icon is required, Please provide skill icon to continue.") }
    const payload = await WallOfCode.create({
        profileId: profileId,
        skillName: skillName,
        skillIcon: skillIcon,
    });
    if (!payload) { throw new ApiError(500, "Error in creating the skill, Please try again.") }
    const updateProfile = await Profile.findByIdAndUpdate(profileId, { $push: { listOfWallOfCodeSkills: payload._id } }, { new: true });
    if (!updateProfile) { throw new ApiError(500, "Error in updating the profile with skill, Please try again.") }
    return res
        .status(201)
        .json(new ApiResponse(201, "Skill created successfully.", payload));
});

const updateSkill = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { skillName, skillIcon } = req.body;
    if (!id) { throw new ApiError(400, "Skill Id is required, Please provide skill id to continue.") }
    if (!skillName) { throw new ApiError(400, "Skill Name is required, Please provide skill name to continue.") }
    if (!skillIcon) { throw new ApiError(400, "Skill Icon is required, Please provide skill icon to continue.") }
    const payload = await WallOfCode.findByIdAndUpdate(id, {
        skillName: skillName,
        skillIcon: skillIcon
    }, { new: true });
    if (!payload) { throw new ApiError(500, "Error in updating the skill, Please try again.") }
    return res
        .status(200)
        .json(new ApiResponse(200, "Skill updated successfully.", payload));
});

const deleteSkill = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) { throw new ApiError(400, "Skill id is required, Please provide skill id to continue.") }
    const payload = await WallOfCode.findByIdAndDelete(id);
    if (!payload) { throw new ApiError(500, "Error in deleting the skill, Please try again.") }
    const updateProfile = await Profile.findByIdAndUpdate(payload.profileId, { $pull: { listOfWallOfCodeSkills: payload._id } }, { new: true });
    if (!updateProfile) { throw new ApiError(500, "Error in updating the profile with skill, Please try again.") }
    return res
        .status(200)
        .json(new ApiResponse(200, "Skill deleted successfully.", payload));
});

const getSkills = asyncHandler(async (req, res) => {
    const { profileId } = req.params;
    if (!profileId) { throw new ApiError(400, "Profile Id is required, Please provide peofile id to continue.") }
    const payload = await WallOfCode.find({ profileId: profileId });
    if (!payload) { throw new ApiError(500, "Error in getting the skills, Please try again.") }
    return res
        .status(200)
        .json(new ApiResponse(200, "Skills fetched successfully.", payload));
});

export { createSkill, updateSkill, deleteSkill, getSkills }