import mongoose from "mongoose";

const wallOfCodeSchema = new mongoose.Schema({
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    skillName: {
        type: String,
        required: true
    },
    skillIcon: {
        type: String,
        required: true
    },
}, { timestamps: true });

const WallOfCode = mongoose.model("WallOfCode", wallOfCodeSchema);

export default WallOfCode;