import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    joiningDate: {
        type: Date,
        required: true
    },
    relievingDate: {
        type: Date,
    },
    jobTitle: {
        type: String,
        required: true
    },
    organizationName: {
        type: String,
        required: true
    },
    responsibilities: [
        {
            type: String,
            required: true,
            trim: true
        }
    ],
    skillsInvolved: [
        {
            type: String,
            required: true
        }
    ],
}, { timestamps: true });

const Experience = mongoose.model("Experience", experienceSchema);

export default Experience;