import mongoose from "mongoose";

const contactMeSchema = new mongoose.Schema({
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    visitorName: {
        type: String,
        required: true
    },
    visitorEmail: {
        type: String,
    },
    visitorPhone: {
        type: String,
    },
    visitorMessage: {
        type: String,
    },
    userReplyMessage: {
        type: String,
    },
}, { timestamps: true });

const ContactMe = mongoose.model("ContactMe", contactMeSchema);

export default ContactMe;