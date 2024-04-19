import mongoose from "mongoose";

const contactMeSchema = new mongoose.Schema({
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
}, { timestamps: true });

const ContactMe = mongoose.model("ContactMe", contactMeSchema);

export default ContactMe;