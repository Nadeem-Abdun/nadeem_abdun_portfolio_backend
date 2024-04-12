import nodemailer from "nodemailer";

const mailHandler = async (email, subject, text) => {
    try {
        const transport = nodemailer.createTransport({
            service: process.env.SMTP_SERVICE,
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            }
        });
        await transport.sendMail({
            from: process.env.SMTP_FROM_USER,
            to: email,
            subject: subject,
            text: text,
        });
        const successMessage = "Mail dispatched successfully to: " + email;
        return successMessage;
    } catch (error) {
        const errorMessage = "Error in sending mail " + error.message;
        return errorMessage;
    }
}

export default mailHandler;