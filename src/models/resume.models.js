import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    resumeURL: {
        type: String,
        required: true
    },
    resumeStatus: {
        type: String,
        enum: ["Active", "InActive"],
        default: "InActive"
    }
}, { timestamps: true });

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;