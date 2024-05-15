import Profile from "../models/profile.models.js";
import ContactMe from "../models/contactMe.models.js";
import asyncHandler from "../utilities/AsyncHandler.utilities.js";
import ApiResponse from "../utilities/ApiResponse.utilities.js";
import ApiError from "../utilities/ApiError.utilities.js";
import mailHandler from "../utilities/MailHandler.utilities.js";

const createContactForm = asyncHandler(async (req, res) => {
    const { profileId } = req.params;
    const { visitorName, visitorEmail, visitorPhone, visitorMessage } = req.body;
    if (!profileId) {
        throw new ApiError(400, "Profile Id is required, Please provide profile id to continue.")
    }
    if (!visitorName) {
        throw new ApiError(400, "Visitor Name is required, Please provide name to continue.")
    }
    const payload = await ContactMe.create({
        profileId: profileId,
        visitorName: visitorName,
        visitorEmail: visitorEmail,
        visitorPhone: visitorPhone,
        visitorMessage: visitorMessage,
        userReplyMessage: "",
    });
    if (!payload) {
        throw new ApiError(500, "Error in creating the contact form, Please try again.")
    }
    const updateProfile = await Profile.findByIdAndUpdate(profileId, { $push: { listOfPersonsContacted: payload._id } }, { new: true });
    if (!updateProfile) {
        throw new ApiError(500, "Error in updating the profile with contact form id, Please try again.");
    }
    return res
        .status(201)
        .json(new ApiResponse(201, "Contact form created successfully", payload));
});

const getContactForms = asyncHandler(async (req, res) => {
    const { profileId } = req.params;
    const payload = await ContactMe.find({ profileId: profileId });
    if (!payload) {
        throw new ApiError(500, "Error is getting the contact forms, Please try again.")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Contact forms fetched successfully", payload));
});

const replyContactForm = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userReplyMessage } = req.body;
    if (!id) {
        throw new ApiError(400, "Contact form id is required, Please provide contact form id to continue.")
    }
    if (!userReplyMessage) {
        throw new ApiError(400, "Reply message is required, Please provide reply message to continue.")
    }
    const contactForm = await ContactMe.findById(id);
    if (!contactForm) {
        throw new ApiError(500, "No contact form found with the provided id, Please try again.")
    }
    if (!contactForm.visitorEmail) {
        throw new ApiError(400, "Visitor email is missing. Cannot send reply.");
    }
    if (contactForm.visitorEmail) {
        const emailSubject = "Reply from Nadeem";
        const emailBody = `Hi ${contactForm.visitorName},\n\n` +
            `This is Nadeem. Thank you for reaching out to us.\n\n` +
            `Your message: ${contactForm.visitorMessage}\n\n` +
            `Our reply: ${userReplyMessage}\n\n` +
            `Thanks and Regards,\nNadeem.`;
        await mailHandler(contactForm.visitorEmail, emailSubject, emailBody);
    }
    const payload = await ContactMe.findByIdAndUpdate(id, { $set: { userReplyMessage: userReplyMessage } }, { new: true });
    if (!payload) {
        throw new ApiError(500, "Failed to update contact form with the reply message, Please try again.")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Contact form replied successfully", payload));
});

const deleteContactForm = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "Contact form id is required, Please provide contact form id to continue.")
    }
    const payload = await ContactMe.findByIdAndDelete(id);
    if (!payload) {
        throw new ApiError(500, "Error is deleting the contact form, Please try again.")
    }
    const updateProfile = await Profile.findByIdAndUpdate(payload.profileId, { $pull: { listOfPersonsContacted: payload._id } }, { new: true });
    if (!updateProfile) {
        throw new ApiError(500, "Error in updating the Profile with Contact Form Id, Please try again.");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Contact form deleted successfully", payload));
});

export { createContactForm, getContactForms, replyContactForm, deleteContactForm }