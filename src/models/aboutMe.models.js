import mongoose from "mongoose";

const aboutMeSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    professionalRoles: [
        {
            type: String,
            required: true
        }
    ],
    introducingLine: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: true
    },
    primaryDescription: {
        type: String,
        required: true,
        trim: true
    },
    secondaryDescription: {
        type: String,
        trim: true
    },
    githubUrl: {
        type: String,
    },
    linkedInUrl: {
        type: String,
    },
    discordUrl: {
        type: String,
    },
    twitterUrl: {
        type: String,
    },
    mailToId: {
        type: String,
    },
    listOfExperiences: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Experience"
        }
    ],
    listOfWallOfCodeSkills: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WallOfCode"
        }
    ],
    listOfProjects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        }
    ],
    listOfPersonsContacted: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ContactMe"
        }
    ],
}, { timestamps: true });

const AboutMe = mongoose.model("AboutMe", aboutMeSchema);

export default AboutMe;