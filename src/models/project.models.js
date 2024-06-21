import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    projectPicture: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    skillsInvolved: [
        {
            type: String,
            required: true
        }
    ],
    websiteUrl: {
        type: String
    },
    repositoryUrl: {
        type: String
    },
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

export default Project;